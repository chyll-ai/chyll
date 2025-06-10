
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

const SYSTEM_PROMPT = `You are a precise lead generation specialist with deep knowledge of French business professionals. Your task is to generate realistic French professionals that EXACTLY match the user's search criteria.

Your response must be a JSON object with EXACTLY this structure:
${JSON.stringify(EXAMPLE_RESPONSE, null, 2)}

CRITICAL MATCHING REQUIREMENTS:
1. JOB TITLE PRECISION: If the user specifies a job title (VP Sales, CTO, etc.), generate ONLY people with that EXACT title or very close equivalent
2. LOCATION PRECISION: If the user specifies a location, generate leads ONLY in that location
3. INDUSTRY PRECISION: If the user mentions an industry, ensure companies match that sector
4. QUANTITY PRECISION: Generate exactly the number requested

QUALITY STANDARDS:
- Use realistic French names (avoid repetitive patterns)
- Create believable French company names that match the requested industry
- Professional email formats: firstname.lastname@company.fr
- Phone numbers: +33 6XXXXXXXX format
- LinkedIn URLs: linkedin.com/in/firstname-lastname-suffix
- Locations should be major French cities: Paris, Lyon, Toulouse, Nice, Bordeaux, Nantes, Marseille, Lille, Strasbourg, Montpellier

COMPANY EXAMPLES by sector:
- Tech: Criteo, BlaBlaCar, Dassault Systèmes, Atos, Capgemini
- Fintech: Lydia, Qonto, PayFit, Leetchi
- E-commerce: Veepee, ManoMano, Leboncoin
- SaaS: Notion (Paris), Algolia, ContentSquare

Be flexible but precise - match the user's intent exactly while maintaining realism.`;

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

    // More focused and precise prompt
    const userPrompt = `Search Query: "${searchQuery}"

Parse this search and generate ${count} unique French professionals that EXACTLY match the criteria.

ANALYSIS INSTRUCTIONS:
1. Extract the specific job title mentioned (if any) - use ONLY this title
2. Extract the specific location mentioned (if any) - use ONLY this location  
3. Extract any industry hints - ensure companies align
4. If no specific criteria given, use reasonable defaults

STRICT MATCHING RULES:
- Job titles must be EXACT matches or professional equivalents
- Locations must be EXACT matches to what's requested
- Each person must be completely unique (different names, emails, companies)
- Companies should be realistic for the industry and role level

Return exactly ${count} leads in the specified JSON format. Focus on accuracy over creativity.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      response_format: { type: "json_object" },
      max_tokens: 3000,
      presence_penalty: 0.6,
      frequency_penalty: 0.8
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseContent);
    
    if (!parsedResponse.leads || !Array.isArray(parsedResponse.leads)) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Enhanced validation with duplicate checking
    const seenNames = new Set();
    const seenEmails = new Set();
    const seenCompanies = new Set();
    
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

      // Check for duplicates
      const fullName = String(lead.full_name).trim();
      const email = String(lead.email).trim().toLowerCase();
      const company = String(lead.company).trim();
      
      if (seenNames.has(fullName)) {
        throw new Error(`Lead ${index + 1} has duplicate name: ${fullName}`);
      }
      if (seenEmails.has(email)) {
        throw new Error(`Lead ${index + 1} has duplicate email: ${email}`);
      }
      if (seenCompanies.has(company)) {
        throw new Error(`Lead ${index + 1} has duplicate company: ${company}`);
      }
      
      seenNames.add(fullName);
      seenEmails.add(email);
      seenCompanies.add(company);

      const validatedLead: Lead = {
        full_name: fullName,
        job_title: String(lead.job_title).trim(),
        company: company,
        location: String(lead.location).trim(),
        email: email,
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

      // Enhanced validation
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

    console.log(`Successfully generated ${validatedLeads.length} unique leads for query: ${searchQuery}`);

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
