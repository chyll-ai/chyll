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

interface RequestData {
  searchQuery: string;
  clientProfile: {
    company_name: string;
    industry: string;
    value_prop: string;
    icp_title: string;
    icp_location: string;
    icp_size: string;
  };
  count?: number;
  isDemoData?: boolean;
  clientId: string; // Required for database insertion
}

interface GeneratedLead {
  full_name: string;
  job_title: string;
  company: string;
  location: string;
  email: string;
  phone_number: string;
  linkedin_url: string;
  linkedin_profile_data: {
    headline?: string;
    summary?: string;
    experience?: string[];
    skills?: string[];
    education?: string[];
    languages?: string[];
    connections?: number;
  };
  status: string;
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert at finding and generating relevant B2B leads based on user queries and company profiles.
Your task is to generate or find realistic French business leads that match the search criteria.

Guidelines for lead generation and search:
- Generate or find leads based on the user's natural language query
- Focus on French business professionals and companies
- Ensure all contact information follows French conventions:
  - Phone numbers in French format (+33 6XX XX XX XX or +33 7XX XX XX XX)
  - Professional email addresses with French domains
  - LinkedIn URLs for French professionals
- Provide rich professional profiles including:
  - Current and past positions
  - Company details (size, industry, location)
  - Professional background
  - Languages (always including French)
  - Education from French institutions
- For company information:
  - Use real French business entities (SA, SARL, SAS, etc.)
  - Focus on companies matching the target profile
  - Include company size and industry details
- For contact generation:
  - Create realistic French names and titles
  - Match job titles with target ICP
  - Ensure location data is specific to French cities/regions
  - Generate appropriate status flags for lead tracking

When processing user queries:
1. Analyze the search intent (industry, role, location, etc.)
2. Generate leads matching the criteria
3. Include complete contact details for immediate use
4. Format data for direct database insertion
5. Ensure all generated data is realistic and usable

The response should be immediately usable for:
- Dashboard display
- Lead tracking
- Contact management
- Sales outreach
- Profile enrichment`;

async function insertLeadsToSupabase(leads: GeneratedLead[], clientId: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration is missing');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const leadsToInsert = leads.map(lead => ({
    client_id: clientId,
    full_name: lead.full_name,
    job_title: lead.job_title,
    company: lead.company,
    location: lead.location,
    email: lead.email,
    phone_number: lead.phone_number,
    linkedin_url: lead.linkedin_url,
    status: lead.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('leads')
    .insert(leadsToInsert)
    .select();

  if (error) {
    throw new Error(`Failed to insert leads: ${error.message}`);
  }

  return data;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: RequestData = await req.json();
    const { searchQuery, clientProfile, count = 5, isDemoData = false, clientId } = requestData;
    
    if (!clientProfile) {
      throw new Error('Client profile is required');
    }

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    const userPrompt = `Generate ${count} relevant B2B leads based on the following criteria:

CLIENT PROFILE:
- Company: ${clientProfile.company_name}
- Industry: ${clientProfile.industry}
- Value Proposition: ${clientProfile.value_prop}
- Target Job Titles: ${clientProfile.icp_title}
- Target Location: ${clientProfile.icp_location}
- Target Company Size: ${clientProfile.icp_size}

SEARCH QUERY:
${searchQuery}

${isDemoData ? 'GENERATE DEMO DATA: Yes - create diverse, complete profiles for demonstration purposes' : ''}

For each lead, provide:
1. Full Name (realistic French name)
2. Job Title (matching ICP)
3. Company (realistic French company name with appropriate legal entity)
4. Location (specific French city)
5. Professional Email (realistic format)
6. Phone Number (French mobile format)
7. LinkedIn URL (realistic format)
8. LinkedIn Profile Data including:
   - Professional headline
   - Summary
   - Recent experience (1-2 entries)
   - Key skills (5-8 relevant to industry)
   - Education (1-2 entries)
   - Languages (French + others)
   - Approximate number of connections
9. Status (should be "à contacter" for new leads)

Format the response as a JSON object with a 'leads' array containing the generated leads.`;

    // Call OpenAI Chat Completions API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: isDemoData ? 0.8 : 0.7, // Slightly higher temperature for more varied demo data
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    const { leads } = JSON.parse(responseText);

    // Insert leads into Supabase
    const insertedLeads = await insertLeadsToSupabase(leads, clientId);

    return new Response(
      JSON.stringify({ 
        message: 'Leads generated and inserted successfully',
        leads: insertedLeads 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});