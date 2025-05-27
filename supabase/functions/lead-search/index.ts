
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

const EXAMPLE_RESPONSE = {
  "leads": [
    {
      "full_name": "Sophie Martin",
      "job_title": "CTO",
      "company": "DataTech SAS",
      "location": "Paris",
      "email": "sophie.martin@datatech.fr",
      "phone_number": "+33 612345678",
      "linkedin_url": "linkedin.com/in/sophie-martin-tech"
    }
  ]
};

const SYSTEM_PROMPT = `You are a lead generation expert. Generate French tech leads matching the search criteria.

Your response must be a JSON object with EXACTLY this structure:
${JSON.stringify(EXAMPLE_RESPONSE, null, 2)}

Requirements:
1. Return EXACTLY the requested number of leads
2. Each lead must have ONLY these fields:
   - full_name: French full name
   - job_title: Tech job title
   - company: French tech company
   - location: French city
   - email: firstname.lastname@company.fr
   - phone_number: +33 6XXXXXXXX
   - linkedin_url: linkedin.com/in/firstname-lastname-xxxx
3. NO additional fields
4. NO empty values
5. Focus on French tech companies
6. Use real company names when possible

The response must be valid JSON and follow the exact format shown above.`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const requestData: RequestData = await req.json();
    const { searchQuery, count = 5 } = requestData;
    const userId = requestData.userId || '';

    if (!searchQuery) {
      throw new Error('Search query is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    const userPrompt = `Generate ${count} French tech leads matching: "${searchQuery}"

Requirements:
1. Return EXACTLY ${count} leads
2. Follow the exact JSON format shown in the system message
3. Include ONLY the specified fields
4. ALL fields must be filled with realistic values
5. Focus on tech companies in France
6. Make sure positions match: ${searchQuery}

Return ONLY a JSON object matching the example format.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
      max_tokens: 2000,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      timeout: 30,
      stream: false
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseContent);
    
    if (!parsedResponse.leads || !Array.isArray(parsedResponse.leads)) {
      throw new Error('Invalid response format from OpenAI');
    }

    const validatedLeads = parsedResponse.leads.map((lead: any, index: number) => {
      const allowedFields = ['full_name', 'job_title', 'company', 'location', 'email', 'phone_number', 'linkedin_url'];
      const extraFields = Object.keys(lead).filter(key => !allowedFields.includes(key));
      if (extraFields.length > 0) {
        throw new Error(`Lead ${index + 1} contains unauthorized fields: ${extraFields.join(', ')}`);
      }

      const missingOrEmptyFields = allowedFields.filter(field => !lead[field] || String(lead[field]).trim() === '');
      if (missingOrEmptyFields.length > 0) {
        throw new Error(`Lead ${index + 1} has missing or empty fields: ${missingOrEmptyFields.join(', ')}`);
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
          source: 'assistant',
          timestamp: new Date().toISOString()
        }
      };

      if (!validatedLead.email.includes('@') || !validatedLead.email.endsWith('.fr')) {
        throw new Error(`Lead ${index + 1} has invalid email format: ${validatedLead.email}`);
      }
      if (!validatedLead.phone_number.startsWith('+33')) {
        throw new Error(`Lead ${index + 1} has invalid phone number format: ${validatedLead.phone_number}`);
      }
      if (!validatedLead.linkedin_url.startsWith('linkedin.com/in/')) {
        throw new Error(`Lead ${index + 1} has invalid LinkedIn URL format: ${validatedLead.linkedin_url}`);
      }

      return validatedLead;
    });

    if (validatedLeads.length !== count) {
      throw new Error(`Expected ${count} leads but got ${validatedLeads.length}`);
    }

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
    console.error('Error generating leads:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        leads: [] 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
