
// @ts-ignore: Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports
import OpenAI from 'npm:openai@4.24.1';

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

const PDL_API_KEY = Deno.env.get('PDL_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const PDL_BASE_URL = 'https://api.peopledatalabs.com/v5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

interface SearchRequest {
  searchQuery: string;
  userId: string;
  count?: number;
  filters?: {
    job_title?: string;
    company?: string;
    location?: string;
    industry?: string;
    seniority?: string;
  };
}

interface PDLSearchResponse {
  status: number;
  data?: {
    data: Array<{
      emails: Array<{ address: string; type: string }>;
      phone_numbers: Array<{ number: string; type: string }>;
      full_name: string;
      linkedin_url: string;
      job_title: string;
      job_company_name: string;
      location_name: string;
      skills: string[];
    }>;
  };
  error?: string;
}

async function parseSearchQueryWithOpenAI(query: string): Promise<any> {
  if (!OPENAI_API_KEY) {
    console.log('OpenAI API key not found, falling back to basic parsing');
    return parseSearchQueryBasic(query);
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });

  const systemPrompt = `You are an expert at parsing job search queries and converting them to structured search criteria for People Data Labs API.

Extract the following information from the user's natural language query and return it as JSON:
- job_title: The job title or role being searched for
- location_country: Country (use full country name like "france", "united states")
- location_region: City or region name
- job_company_industry: Industry sector
- job_seniority: Seniority level (entry, mid, senior, executive, etc.)

Rules:
- For French locations like "Paris", "Lyon", etc., set location_country to "france"
- Convert French job titles to English equivalents when possible
- For "RH" or "Ressources Humaines", use "Human Resources" or "HR"
- For "Commercial", use "Sales" 
- For "Développeur", use "Developer"
- Be flexible with job titles - extract the core meaning
- If location is just a city, infer the country when obvious
- Return only the JSON object, no other text

Example query: "trouve moi 5 leads de rh à paris"
Expected output: {"job_title": "Human Resources", "location_country": "france", "location_region": "paris"}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.1,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const searchCriteria = JSON.parse(responseContent);
    console.log('OpenAI parsed search criteria:', searchCriteria);
    return searchCriteria;
  } catch (error) {
    console.error('OpenAI parsing failed:', error);
    console.log('Falling back to basic parsing');
    return parseSearchQueryBasic(query);
  }
}

function parseSearchQueryBasic(query: string): any {
  const searchCriteria: any = {};
  const queryLower = query.toLowerCase();

  // Basic French location detection
  const frenchCities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille'];
  for (const city of frenchCities) {
    if (queryLower.includes(city)) {
      searchCriteria.location_country = 'france';
      searchCriteria.location_region = city;
      break;
    }
  }

  // Basic job title detection
  if (queryLower.includes('rh') || queryLower.includes('ressources humaines')) {
    searchCriteria.job_title = 'Human Resources';
  } else if (queryLower.includes('commercial') || queryLower.includes('sales')) {
    searchCriteria.job_title = 'Sales';
  } else if (queryLower.includes('développeur') || queryLower.includes('developer')) {
    searchCriteria.job_title = 'Developer';
  } else if (queryLower.includes('cto')) {
    searchCriteria.job_title = 'CTO';
  }

  return searchCriteria;
}

async function searchPeopleWithPDL(searchParams: any, count: number = 10): Promise<PDLSearchResponse> {
  if (!PDL_API_KEY) {
    throw new Error('PDL_API_KEY is not configured');
  }

  // Build the search body directly - PDL expects parameters at the root level, not nested in a query object
  const searchBody: any = {
    size: Math.min(count, 100),
    pretty: true
  };
  
  // Add search parameters directly to the request body (not nested in a query object)
  if (searchParams.job_title) {
    searchBody.job_title_role = searchParams.job_title.toLowerCase();
  }
  
  if (searchParams.location_country) {
    searchBody.location_country = searchParams.location_country.toLowerCase();
  }
  
  if (searchParams.location_region) {
    searchBody.location_region = searchParams.location_region.toLowerCase();
  }
  
  if (searchParams.job_company_industry) {
    searchBody.job_company_industry = searchParams.job_company_industry.toLowerCase();
  }
  
  if (searchParams.job_seniority) {
    searchBody.job_seniority = searchParams.job_seniority.toLowerCase();
  }

  // Ensure we have at least one search parameter
  const hasSearchParams = Object.keys(searchBody).some(key => 
    key !== 'size' && key !== 'pretty' && searchBody[key]
  );
  
  if (!hasSearchParams) {
    searchBody.job_title_role = 'manager'; // Default fallback
  }

  console.log('PDL Search request:', JSON.stringify(searchBody, null, 2));

  const response = await fetch(`${PDL_BASE_URL}/person/search`, {
    method: 'POST',
    headers: {
      'X-Api-Key': PDL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(searchBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PDL Search API error:', response.status, errorText);
    throw new Error(`PDL Search API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('PDL search successful, found:', data.data?.length || 0, 'results');
  
  return {
    status: response.status,
    data
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery, userId, count = 10, filters }: SearchRequest = await req.json();

    if (!searchQuery || !userId) {
      throw new Error('Search query and user ID are required');
    }

    console.log(`Processing search query: "${searchQuery}"`);

    // Use OpenAI to intelligently parse the search query
    const searchCriteria = await parseSearchQueryWithOpenAI(searchQuery);
    
    // Apply additional filters if provided
    if (filters) {
      Object.assign(searchCriteria, filters);
    }

    console.log('Final search criteria:', searchCriteria);

    const searchResults = await searchPeopleWithPDL(searchCriteria, count);

    // Transform PDL results to our lead format
    const leads = searchResults.data?.data?.map((person: any) => ({
      id: crypto.randomUUID(),
      client_id: userId,
      full_name: person.full_name || 'N/A',
      job_title: person.job_title || 'N/A',
      company: person.job_company_name || 'N/A',
      location: person.location_name || 'N/A',
      email: person.emails?.[0]?.address || '',
      phone_number: person.phone_numbers?.[0]?.number || '',
      linkedin_url: person.linkedin_url || '',
      status: 'new',
      created_at: new Date().toISOString(),
      enriched_from: {
        source: 'peopledatalabs',
        timestamp: new Date().toISOString(),
        query: searchQuery,
        parsed_criteria: searchCriteria
      },
      linkedin_profile_data: {
        skills: person.skills || [],
        summary: person.summary || ''
      }
    })) || [];

    return new Response(
      JSON.stringify({
        success: true,
        leads,
        total: searchResults.data?.data?.length || 0,
        query: searchQuery,
        searchCriteria
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in PDL search function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        leads: []
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
