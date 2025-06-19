
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

async function getExistingLeadEmails(userId: string): Promise<Set<string>> {
  try {
    const response = await fetch(`${PDL_BASE_URL.replace('/v5', '')}/rest/v1/leads?select=email&client_id=eq.${userId}`, {
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return new Set(data.map((lead: any) => lead.email).filter(Boolean));
    }
  } catch (error) {
    console.error('Error fetching existing leads:', error);
  }
  
  return new Set();
}

async function parseSearchQueryWithOpenAI(query: string, existingEmails: Set<string>): Promise<any> {
  if (!OPENAI_API_KEY) {
    console.log('OpenAI API key not found, falling back to basic parsing');
    return parseSearchQueryBasic(query);
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });

  const systemPrompt = `You are an expert at parsing job search queries and converting them to diverse, specific search criteria for People Data Labs API.

Your goal is to generate MULTIPLE search variations to avoid duplicate results and find diverse candidates.

Extract the following information from the user's natural language query and return it as JSON with MULTIPLE search strategies:

Primary search strategy:
- job_title: The main job title or role being searched for
- location_name: Full location name (city, region, country format like "paris, île-de-france, france")
- job_company_industry: Industry sector
- job_seniority: Seniority level (entry, mid, senior, executive, etc.)

Alternative search strategies (provide 2-3 alternatives):
- alt_searches: Array of alternative search objects with different combinations of:
  - More specific job titles
  - Related job titles in the same field
  - Skills-based searches instead of job titles
  - Different industry focuses
  - Different seniority levels

Rules:
- For French locations like "Paris", use the full format "paris, île-de-france, france"
- For "Lyon", use "lyon, auvergne-rhône-alpes, france"
- For "Toulouse", use "toulouse, occitanie, france"
- Convert French job titles to English equivalents when possible
- For "RH" or "Ressources Humaines", provide alternatives: "Human Resources Manager", "HR Manager", "Talent Acquisition", "People Operations"
- For "Commercial", provide alternatives: "Sales Manager", "Business Development", "Account Manager", "Sales Representative"
- For "Communication", provide alternatives: "Marketing Manager", "Communications Specialist", "Public Relations", "Content Manager", "Digital Marketing"
- For "Développeur", provide alternatives: "Software Developer", "Software Engineer", "Frontend Developer", "Backend Developer"
- Use lowercase for all values
- Return only the JSON object, no other text
- Make alternative searches significantly different to avoid duplicates

Example query: "trouve moi des profils communication à toulouse"
Expected output: {
  "job_title": "communications specialist",
  "location_name": "toulouse, occitanie, france",
  "alt_searches": [
    {"job_title": "marketing manager", "location_name": "toulouse, occitanie, france"},
    {"job_title": "public relations", "location_name": "toulouse, occitanie, france", "job_company_industry": "marketing and advertising"},
    {"job_title": "content manager", "location_name": "toulouse, occitanie, france", "job_seniority": "mid"}
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.3,
      max_tokens: 500,
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
  const searchCriteria: any = {
    alt_searches: []
  };
  const queryLower = query.toLowerCase();

  // Basic French location detection with full format
  if (queryLower.includes('paris')) {
    searchCriteria.location_name = 'paris, île-de-france, france';
  } else if (queryLower.includes('lyon')) {
    searchCriteria.location_name = 'lyon, auvergne-rhône-alpes, france';
  } else if (queryLower.includes('marseille')) {
    searchCriteria.location_name = 'marseille, provence-alpes-côte d\'azur, france';
  } else if (queryLower.includes('toulouse')) {
    searchCriteria.location_name = 'toulouse, occitanie, france';
  }

  // Basic job title detection with alternatives
  if (queryLower.includes('rh') || queryLower.includes('ressources humaines')) {
    searchCriteria.job_title = 'human resources manager';
    searchCriteria.alt_searches = [
      { job_title: 'talent acquisition', location_name: searchCriteria.location_name },
      { job_title: 'hr manager', location_name: searchCriteria.location_name }
    ];
  } else if (queryLower.includes('commercial') || queryLower.includes('sales')) {
    searchCriteria.job_title = 'sales manager';
    searchCriteria.alt_searches = [
      { job_title: 'business development', location_name: searchCriteria.location_name },
      { job_title: 'account manager', location_name: searchCriteria.location_name }
    ];
  } else if (queryLower.includes('communication')) {
    searchCriteria.job_title = 'communications specialist';
    searchCriteria.alt_searches = [
      { job_title: 'marketing manager', location_name: searchCriteria.location_name },
      { job_title: 'public relations', location_name: searchCriteria.location_name }
    ];
  } else if (queryLower.includes('développeur') || queryLower.includes('developer')) {
    searchCriteria.job_title = 'software developer';
    searchCriteria.alt_searches = [
      { job_title: 'software engineer', location_name: searchCriteria.location_name },
      { job_title: 'frontend developer', location_name: searchCriteria.location_name }
    ];
  } else if (queryLower.includes('cto')) {
    searchCriteria.job_title = 'cto';
  }

  return searchCriteria;
}

async function searchPeopleWithPDL(searchParams: any, count: number = 10, excludeEmails: Set<string> = new Set()): Promise<PDLSearchResponse> {
  if (!PDL_API_KEY) {
    throw new Error('PDL_API_KEY is not configured');
  }

  // Build SQL query conditions
  const conditions: string[] = [];
  
  if (searchParams.job_title) {
    conditions.push(`job_title = '${searchParams.job_title.toLowerCase()}'`);
  }
  
  if (searchParams.location_name) {
    conditions.push(`location_name = '${searchParams.location_name.toLowerCase()}'`);
  }
  
  if (searchParams.job_company_industry) {
    conditions.push(`job_company_industry = '${searchParams.job_company_industry.toLowerCase()}'`);
  }
  
  if (searchParams.job_seniority) {
    conditions.push(`job_seniority = '${searchParams.job_seniority.toLowerCase()}'`);
  }

  // Exclude existing emails
  if (excludeEmails.size > 0) {
    const emailExclusions = Array.from(excludeEmails).map(email => `'${email}'`).join(',');
    conditions.push(`emails NOT ILIKE ANY(ARRAY[${emailExclusions}])`);
  }

  // Default to searching for managers if no conditions
  if (conditions.length === 0) {
    conditions.push(`job_title = 'manager'`);
  }

  // Construct the SQL query
  const sql = `SELECT * FROM person WHERE (${conditions.join(' AND ')})`;
  
  const searchBody = {
    sql: sql,
    size: Math.min(count, 100),
    pretty: true
  };

  console.log('PDL Search request with SQL:', JSON.stringify(searchBody, null, 2));

  try {
    const response = await fetch(`${PDL_BASE_URL}/person/search`, {
      method: 'POST',
      headers: {
        'X-Api-Key': PDL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    });

    const responseText = await response.text();
    console.log('PDL API response status:', response.status);
    console.log('PDL API response text:', responseText);

    if (!response.ok) {
      console.error('PDL Search API error:', response.status, responseText);
      throw new Error(`PDL Search API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('PDL search successful, found:', data.data?.length || 0, 'results');
    
    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('Error in PDL search request:', error);
    throw error;
  }
}

async function performDiversifiedSearch(searchCriteria: any, count: number, excludeEmails: Set<string>): Promise<any[]> {
  const allLeads: any[] = [];
  const targetCount = count;
  
  // Try primary search first
  try {
    console.log('Trying primary search:', searchCriteria);
    const primaryResults = await searchPeopleWithPDL(searchCriteria, Math.ceil(targetCount / 2), excludeEmails);
    if (primaryResults.data?.data) {
      allLeads.push(...primaryResults.data.data);
      console.log('Primary search found:', primaryResults.data.data.length, 'leads');
    }
  } catch (error) {
    console.error('Primary search failed:', error);
  }

  // Try alternative searches if we need more leads
  if (allLeads.length < targetCount && searchCriteria.alt_searches) {
    for (const altSearch of searchCriteria.alt_searches) {
      if (allLeads.length >= targetCount) break;
      
      try {
        console.log('Trying alternative search:', altSearch);
        const remainingCount = targetCount - allLeads.length;
        const altResults = await searchPeopleWithPDL(altSearch, remainingCount, excludeEmails);
        
        if (altResults.data?.data) {
          // Filter out duplicates by email
          const existingEmails = new Set(allLeads.map(lead => lead.emails?.[0]?.address).filter(Boolean));
          const newLeads = altResults.data.data.filter(person => {
            const email = person.emails?.[0]?.address;
            return email && !existingEmails.has(email);
          });
          
          allLeads.push(...newLeads);
          console.log('Alternative search found:', newLeads.length, 'new leads');
        }
      } catch (error) {
        console.error('Alternative search failed:', error);
        continue;
      }
    }
  }

  return allLeads;
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

    // Get existing lead emails to avoid duplicates
    const existingEmails = await getExistingLeadEmails(userId);
    console.log('Found', existingEmails.size, 'existing lead emails to exclude');

    // Use OpenAI to intelligently parse the search query with diversification
    const searchCriteria = await parseSearchQueryWithOpenAI(searchQuery, existingEmails);
    
    // Apply additional filters if provided
    if (filters) {
      Object.assign(searchCriteria, filters);
    }

    console.log('Final search criteria:', searchCriteria);

    // Perform diversified search with multiple strategies
    const allLeads = await performDiversifiedSearch(searchCriteria, count, existingEmails);

    // Transform PDL results to our lead format with proper location handling
    const leads = allLeads.map((person: any) => {
      // Log the actual person object structure to debug location issues
      console.log('Processing person object:', JSON.stringify(person, null, 2));
      
      // Extract location with defensive checking and fallbacks
      let location = 'Unknown';
      
      // Check various location fields that PDL might return
      if (typeof person.location_name === 'string' && person.location_name.trim()) {
        location = person.location_name;
      } else if (typeof person.location_country === 'string' && person.location_country.trim()) {
        location = person.location_country;
      } else if (person.job_company_location_name && typeof person.job_company_location_name === 'string') {
        location = person.job_company_location_name;
      }
      
      console.log('Extracted location for', person.full_name, ':', location);
      
      return {
        id: crypto.randomUUID(),
        client_id: userId,
        full_name: person.full_name || 'N/A',
        job_title: person.job_title || 'N/A',
        company: person.job_company_name || 'N/A',
        location: location,
        email: person.emails?.[0]?.address || '',
        phone_number: person.phone_numbers?.[0]?.number || '',
        linkedin_url: person.linkedin_url || '',
        status: 'new',
        created_at: new Date().toISOString(),
        enriched_from: {
          source: 'peopledatalabs',
          timestamp: new Date().toISOString(),
          query: searchQuery,
          parsed_criteria: searchCriteria,
          search_strategy: 'diversified'
        },
        linkedin_profile_data: {
          skills: person.skills || [],
          summary: person.summary || ''
        }
      };
    });

    const responseMessage = leads.length > 0 
      ? `Found ${leads.length} diverse leads using multiple search strategies.`
      : allLeads.length === 0 
        ? 'No new leads found. Try using different search terms or criteria.'
        : `Found ${allLeads.length} results but all were existing leads in your database.`;

    return new Response(
      JSON.stringify({
        success: true,
        leads,
        total: leads.length,
        query: searchQuery,
        searchCriteria,
        message: responseMessage,
        strategiesUsed: searchCriteria.alt_searches ? ['primary', 'alternatives'] : ['primary'],
        existingLeadsExcluded: existingEmails.size
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
