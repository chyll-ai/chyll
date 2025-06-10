
// @ts-ignore: Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports
import OpenAI from 'npm:openai@4.24.1';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

const SYSTEM_PROMPT = `You are a helpful French business assistant that helps users find and manage leads.
Your primary functions are:

1. Lead Search and Generation:
- Process natural language queries about potential leads
- Search for leads based on industry, role, location, etc.
- Generate realistic French business contact information
- Ensure all data follows French business conventions

2. Lead Management:
- Help users track and update lead status
- Suggest follow-up actions
- Provide insights about leads and companies

3. Contact Information:
- Generate and validate French contact details
- Create professional profiles with complete information
- Ensure all data is properly formatted for the database

4. Business Intelligence:
- Provide insights about French companies and industries
- Suggest potential leads based on user's target profile
- Help qualify leads based on available information

Respond in French and ensure all generated data follows French business conventions.
Format responses to be clear and actionable for the dashboard interface.`;

async function searchAndGenerateLeads(query: string, userId: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration is missing');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Get user's client profile for context
  const { data: clientProfile } = await supabase
    .from('client_profile')
    .select('*')
    .eq('client_id', userId)
    .single();

  // Call lead-search function with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/lead-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: query,
        clientProfile,
        clientId: userId,
        isDemoData: !clientProfile?.is_complete
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lead search failed:', errorText);
      throw new Error(`Failed to search leads: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Lead search timed out');
    }
    throw error;
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    // First, let OpenAI analyze the user's request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('OpenAI request timed out');
      }
      throw error;
    }

    const aiResponse = completion.choices[0]?.message?.content || '';

    // If the message seems to be about finding leads, call the lead search function
    if (message.toLowerCase().includes('trouver') || 
        message.toLowerCase().includes('chercher') ||
        message.toLowerCase().includes('rechercher') ||
        message.toLowerCase().includes('leads') ||
        message.toLowerCase().includes('prospects')) {
      try {
        console.log('Attempting lead search for query:', message);
        const leadResults = await searchAndGenerateLeads(message, userId);
        console.log('Lead search successful, found:', leadResults.leads?.length || 0, 'leads');
        
        return new Response(
          JSON.stringify({
            message: `${aiResponse}\n\nJ'ai trouvé ${leadResults.leads?.length || 0} leads correspondant à votre recherche. Vous pouvez les voir dans le tableau des leads.`,
            leads: leadResults.leads || []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Lead search error:', error);
        return new Response(
          JSON.stringify({
            message: `${aiResponse}\n\nDésolé, j'ai rencontré une erreur lors de la recherche des leads: ${error.message}. Veuillez réessayer.`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // For other types of messages, just return the AI response
    return new Response(
      JSON.stringify({ message: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in openai-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: 'Désolé, j\'ai rencontré une erreur technique. Veuillez réessayer.'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
