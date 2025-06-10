
// @ts-ignore: Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports
import OpenAI from 'npm:openai@4.24.1';

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

interface RequestData {
  searchQuery: string;
  count?: number;
  userId?: string;
}

interface Lead {
  full_name: string;
  job_title: string;
  company: string;
  location: string;
  email: string;
  phone_number: string;
  linkedin_url: string;
  client_id: string;
  id: string;
  created_at: string;
  status: string;
  enriched_from: {
    source: string;
    timestamp: string;
  };
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

const SYSTEM_PROMPT = `You are a lead generation specialist. Generate realistic French professionals that match the search criteria.

CRITICAL: You must respond with EXACTLY this JSON structure:
{
  "leads": [
    {
      "full_name": "Sophie Martin",
      "job_title": "CTO",
      "company": "DataTech SAS",
      "location": "Paris",
      "email": "sophie.martin@datatech.fr",
      "phone_number": "+33612345678",
      "linkedin_url": "linkedin.com/in/sophie-martin-tech"
    }
  ]
}

Requirements:
- Use realistic French names and companies
- Professional email format: firstname.lastname@company.fr
- Phone: +33 6XXXXXXXX format
- LinkedIn: linkedin.com/in/firstname-lastname-suffix
- Major French cities only
- Keep response under 1000 tokens`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Lead search function started');

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const requestData: RequestData = await req.json();
    const { searchQuery, count = 3 } = requestData; // Reduced default count
    const userId = requestData.userId || '';

    if (!searchQuery) {
      throw new Error('Search query is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Cap count at 5 to prevent large responses
    const safeCount = Math.min(count, 5);
    console.log(`Processing search query: "${searchQuery}" for ${safeCount} leads`);

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    // Simplified and shorter prompt
    const userPrompt = `Generate ${safeCount} French business professionals for: "${searchQuery}"

Return exactly ${safeCount} leads in the JSON format specified. Be concise.`;

    console.log('Calling OpenAI API...');

    // Reduced timeout and token limits
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use faster model
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 800, // Reduced from 1500
      timeout: 10000 // 10 second timeout
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      console.error('No response content from OpenAI');
      throw new Error('No response from OpenAI');
    }

    console.log(`OpenAI response length: ${responseContent.length} characters`);

    // Check response size
    if (responseContent.length > 5000) {
      console.error('Response too large, truncating...');
      throw new Error('Response too large, please try with fewer leads');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Response content preview:', responseContent.substring(0, 500));
      throw new Error('Invalid JSON response from OpenAI');
    }
    
    if (!parsedResponse.leads || !Array.isArray(parsedResponse.leads)) {
      console.error('Invalid response structure:', parsedResponse);
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate and clean leads
    const validatedLeads = parsedResponse.leads.slice(0, safeCount).map((lead: any, index: number) => {
      const requiredFields = ['full_name', 'job_title', 'company', 'location', 'email', 'phone_number', 'linkedin_url'];
      
      // Check for missing fields
      for (const field of requiredFields) {
        if (!lead[field] || String(lead[field]).trim() === '') {
          throw new Error(`Lead ${index + 1} missing field: ${field}`);
        }
      }

      const validatedLead: Lead = {
        full_name: String(lead.full_name).trim(),
        job_title: String(lead.job_title).trim(),
        company: String(lead.company).trim(),
        location: String(lead.location).trim(),
        email: String(lead.email).trim().toLowerCase(),
        phone_number: String(lead.phone_number).trim(),
        linkedin_url: String(lead.linkedin_url).trim(),
        client_id: userId,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        status: 'new',
        enriched_from: {
          source: 'openai_assistant',
          timestamp: new Date().toISOString()
        }
      };

      // Basic validation
      if (!validatedLead.email.includes('@')) {
        throw new Error(`Lead ${index + 1} has invalid email: ${validatedLead.email}`);
      }
      if (!validatedLead.phone_number.startsWith('+33')) {
        validatedLead.phone_number = '+33' + validatedLead.phone_number.replace(/^\+?33?/, '');
      }

      return validatedLead;
    });

    console.log(`Successfully generated ${validatedLeads.length} leads`);

    return new Response(
      JSON.stringify({
        message: 'Leads generated successfully',
        leads: validatedLeads
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in lead-search function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        leads: [],
        message: `Failed to generate leads: ${errorMessage}`
      }),
      { 
        status: 200, // Keep 200 to prevent cascade failures
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
