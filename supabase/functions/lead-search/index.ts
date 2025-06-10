
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

const SYSTEM_PROMPT = `You are an expert lead generation specialist with deep knowledge of French business professionals and companies. Generate realistic French tech leads that match specific search criteria.

Your response must be a JSON object with EXACTLY this structure:
${JSON.stringify(EXAMPLE_RESPONSE, null, 2)}

CRITICAL REQUIREMENTS:
1. Generate UNIQUE professionals - no duplicate names or emails
2. Match job titles PRECISELY to the search query (if searching for "CTO", generate CTOs, not generic "developers")
3. Use realistic French names (avoid generic combinations like "Martin Martin")
4. Create believable company names that match the industry
5. Ensure job titles align with company size and industry
6. Use realistic French locations (major tech hubs: Paris, Lyon, Toulouse, Nice, Bordeaux, Nantes)
7. Generate professional email formats: firstname.lastname@company.fr
8. Phone numbers: +33 6XXXXXXXX format
9. LinkedIn URLs: linkedin.com/in/firstname-lastname-suffix

QUALITY STANDARDS:
- Senior roles (CTO, VP, Director) should be at established companies
- Junior roles should be at appropriate companies for their level
- Company names should reflect real French business naming conventions
- Avoid repetitive patterns in names, companies, or locations
- Each lead should feel like a real person with a believable career path

Focus on generating leads that would realistically hold the requested position and work at companies that would hire for that role.`;

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

    // Enhanced prompt with better context and instructions
    const userPrompt = `Generate ${count} unique French tech professionals matching: "${searchQuery}"

SEARCH CONTEXT: ${searchQuery}

SPECIFIC INSTRUCTIONS:
1. If the search mentions a specific job title (e.g., "CTO", "Lead Developer", "Product Manager"), generate ONLY people with that exact title
2. If the search mentions an industry (e.g., "fintech", "e-commerce", "AI"), ensure companies and roles align with that sector
3. If the search mentions a location, prioritize that location but add variety
4. Generate completely unique individuals - check that no two people have:
   - The same first + last name combination
   - The same email address
   - The same company name
   - The same LinkedIn URL

REALISM REQUIREMENTS:
- Senior executives (C-level) should be at companies with 50+ employees
- Mid-level roles should match company size appropriately
- Startup roles should be at smaller, innovative companies
- Enterprise roles should be at established French tech companies

COMPANY EXAMPLES for inspiration (create similar but different):
- Tech: Criteo, BlaBlaCar, Dassault Systèmes, Atos, Capgemini
- Fintech: Lydia, Qonto, PayFit, Leetchi
- E-commerce: Veepee, ManoMano, Leboncoin
- AI/Data: Dataiku, Shift Technology, Owkin

Return EXACTLY ${count} unique leads in the specified JSON format. Each lead must be completely different from the others.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8, // Increased for more variety
      response_format: { type: "json_object" },
      max_tokens: 3000, // Increased for more detailed responses
      presence_penalty: 0.6, // Higher to avoid repetition
      frequency_penalty: 0.8, // Higher to ensure uniqueness
      timeout: 45,
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
