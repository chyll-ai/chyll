
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
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
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

interface ExistingLead {
  email: string;
  full_name: string;
  company: string;
}

async function getExistingLeads(userId: string): Promise<ExistingLead[]> {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase configuration');
      return [];
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=email,full_name,company&client_id=eq.${userId}`, {
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Found existing leads:', data.length, 'leads');
      return data.filter((lead: any) => lead.email || lead.full_name);
    } else {
      console.error('Failed to fetch existing leads:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Error fetching existing leads:', error);
  }
  
  return [];
}

function isExistingLead(person: any, existingLeads: ExistingLead[]): boolean {
  const email = person.emails?.[0]?.address?.toLowerCase();
  const fullName = person.full_name?.toLowerCase();
  const company = person.job_company_name?.toLowerCase();

  return existingLeads.some(existing => {
    // Check email match
    if (email && existing.email?.toLowerCase() === email) {
      return true;
    }
    
    // Check name + company match (stricter duplicate detection)
    if (fullName && company && 
        existing.full_name?.toLowerCase() === fullName && 
        existing.company?.toLowerCase() === company) {
      return true;
    }
    
    return false;
  });
}

async function parseSearchQueryWithOpenAI(query: string): Promise<any> {
  if (!OPENAI_API_KEY) {
    console.log('OpenAI API key not found, falling back to basic parsing');
    return parseSearchQueryBasic(query);
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });

  const systemPrompt = `You are an expert at parsing job search queries and converting them to search criteria for People Data Labs API.

Your goal is to generate SIMPLE, FOCUSED search parameters that work reliably with PDL.

Extract the following information and return as JSON:

Primary search strategy:
- job_title: The main job title (use English equivalents)
- location_name: Full location format like "city, region, country" 
- job_company_industry: Industry sector (optional, only if clearly specified)

Alternative search strategies (provide 2-3 SIMPLE alternatives):
- alt_searches: Array of alternative search objects with different:
  - Job titles (use synonyms, related roles)
  - Industries (vary if helpful)

Rules:
- For French locations, use full format: "paris, île-de-france, france"
- Convert French terms to English equivalents
- Use lowercase for all values
- Keep searches SIMPLE - avoid complex conditions
- DO NOT use job_seniority or other unsupported fields
- Return only JSON, no other text

Example for "responsable rh à paris":
{
  "job_title": "human resources manager",
  "location_name": "paris, île-de-france, france",
  "job_company_industry": "technology",
  "alt_searches": [
    {"job_title": "hr manager", "location_name": "paris, île-de-france, france"},
    {"job_title": "talent acquisition", "location_name": "paris, île-de-france, france", "job_company_industry": "finance"}
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Parse this search query: "${query}"` }
      ],
      temperature: 0.3,
      max_tokens: 400,
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

  // Basic French location detection
  if (queryLower.includes('paris')) {
    searchCriteria.location_name = 'paris, île-de-france, france';
  } else if (queryLower.includes('lyon')) {
    searchCriteria.location_name = 'lyon, auvergne-rhône-alpes, france';
  } else if (queryLower.includes('marseille')) {
    searchCriteria.location_name = 'marseille, provence-alpes-côte d\'azur, france';
  } else if (queryLower.includes('toulouse')) {
    searchCriteria.location_name = 'toulouse, occitanie, france';
  }

  // Basic job title detection
  if (queryLower.includes('rh') || queryLower.includes('ressources humaines')) {
    searchCriteria.job_title = 'human resources manager';
    searchCriteria.alt_searches = [
      { job_title: 'hr manager', location_name: searchCriteria.location_name },
      { job_title: 'talent acquisition', location_name: searchCriteria.location_name }
    ];
  } else if (queryLower.includes('commercial') || queryLower.includes('sales')) {
    searchCriteria.job_title = 'sales manager';
    searchCriteria.alt_searches = [
      { job_title: 'business development', location_name: searchCriteria.location_name },
      { job_title: 'account manager', location_name: searchCriteria.location_name }
    ];
  } else if (queryLower.includes('communication')) {
    searchCriteria.job_title = 'marketing manager';
    searchCriteria.alt_searches = [
      { job_title: 'communications specialist', location_name: searchCriteria.location_name },
      { job_title: 'brand manager', location_name: searchCriteria.location_name }
    ];
  } else if (queryLower.includes('développeur') || queryLower.includes('developer')) {
    searchCriteria.job_title = 'software developer';
    searchCriteria.alt_searches = [
      { job_title: 'software engineer', location_name: searchCriteria.location_name },
      { job_title: 'frontend developer', location_name: searchCriteria.location_name }
    ];
  } else {
    // Default fallback
    searchCriteria.job_title = 'manager';
  }

  return searchCriteria;
}

async function searchPeopleWithPDL(searchParams: any, count: number = 10): Promise<PDLSearchResponse> {
  if (!PDL_API_KEY) {
    throw new Error('PDL_API_KEY is not configured');
  }

  // Build simple SQL query conditions - only use supported fields
  const conditions: string[] = [];
  
  if (searchParams.job_title) {
    // Escape single quotes properly
    const jobTitle = searchParams.job_title.replace(/'/g, "''");
    conditions.push(`job_title = '${jobTitle}'`);
  }
  
  if (searchParams.location_name) {
    // Escape single quotes properly
    const location = searchParams.location_name.replace(/'/g, "''");
    conditions.push(`location_name = '${location}'`);
  }
  
  if (searchParams.job_company_industry) {
    // Escape single quotes properly
    const industry = searchParams.job_company_industry.replace(/'/g, "''");
    conditions.push(`job_company_industry = '${industry}'`);
  }

  // Default to searching for managers if no conditions
  if (conditions.length === 0) {
    conditions.push(`job_title = 'manager'`);
  }

  // Construct simple SQL query
  const sql = `SELECT * FROM person WHERE (${conditions.join(' AND ')})`;
  
  const searchBody = {
    sql: sql,
    size: Math.min(count * 2, 50), // Request 2x to account for filtering
    pretty: true
  };

  console.log('PDL Search request:', JSON.stringify(searchBody, null, 2));

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

async function performDiversifiedSearch(searchCriteria: any, count: number, existingLeads: ExistingLead[]): Promise<any[]> {
  const allLeads: any[] = [];
  const targetCount = count;
  const usedKeys = new Set<string>(); // Track unique combinations
  
  // Helper function to create unique key
  const createUniqueKey = (person: any) => {
    const email = person.emails?.[0]?.address?.toLowerCase();
    const name = person.full_name?.toLowerCase();
    const company = person.job_company_name?.toLowerCase();
    return `${email || 'no-email'}-${name || 'no-name'}-${company || 'no-company'}`;
  };

  // Try primary search first
  try {
    console.log('Trying primary search:', searchCriteria);
    const primaryResults = await searchPeopleWithPDL(searchCriteria, Math.ceil(targetCount / 2));
    if (primaryResults.data?.data) {
      // Filter out duplicates and existing leads
      const filteredResults = primaryResults.data.data.filter(person => {
        const uniqueKey = createUniqueKey(person);
        
        // Skip if already processed
        if (usedKeys.has(uniqueKey)) {
          return false;
        }
        
        // Skip if exists in user's current leads
        if (isExistingLead(person, existingLeads)) {
          console.log('Skipping existing lead:', person.full_name);
          return false;
        }
        
        // Skip if no email
        if (!person.emails?.[0]?.address) {
          return false;
        }
        
        usedKeys.add(uniqueKey);
        return true;
      });
      
      allLeads.push(...filteredResults);
      console.log('Primary search found:', filteredResults.length, 'unique leads');
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
        const altResults = await searchPeopleWithPDL(altSearch, remainingCount * 2);
        
        if (altResults.data?.data) {
          // Filter out duplicates by unique key
          const newLeads = altResults.data.data.filter(person => {
            const uniqueKey = createUniqueKey(person);
            
            if (usedKeys.has(uniqueKey)) {
              return false;
            }
            
            if (isExistingLead(person, existingLeads)) {
              console.log('Skipping existing lead in alt search:', person.full_name);
              return false;
            }
            
            if (!person.emails?.[0]?.address) {
              return false;
            }
            
            usedKeys.add(uniqueKey);
            return true;
          });
          
          allLeads.push(...newLeads);
          console.log('Alternative search found:', newLeads.length, 'new unique leads');
        }
      } catch (error) {
        console.error('Alternative search failed:', error);
        continue;
      }
    }
  }

  // Return up to the requested count
  const finalLeads = allLeads.slice(0, targetCount);
  console.log('Total unique leads after diversified search:', finalLeads.length);
  
  return finalLeads;
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

    // Get existing leads for post-processing deduplication
    const existingLeads = await getExistingLeads(userId);
    console.log('Found', existingLeads.length, 'existing leads to exclude');

    // Use OpenAI to intelligently parse the search query
    const searchCriteria = await parseSearchQueryWithOpenAI(searchQuery);
    
    // Apply additional filters if provided
    if (filters) {
      Object.assign(searchCriteria, filters);
    }

    console.log('Final search criteria:', searchCriteria);

    // Perform diversified search with post-processing deduplication
    const allLeads = await performDiversifiedSearch(searchCriteria, count, existingLeads);

    // Transform PDL results to our lead format
    const leads = allLeads.map((person: any) => {
      // Enhanced location extraction
      let location = 'Unknown';
      
      if (typeof person.location_name === 'string' && person.location_name.trim()) {
        location = person.location_name;
      } else if (typeof person.location_country === 'string' && person.location_country.trim()) {
        location = person.location_country;
      } else if (person.job_company_location_name && typeof person.job_company_location_name === 'string') {
        location = person.job_company_location_name;
      }
      
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
          search_strategy: 'simplified_with_post_processing'
        },
        linkedin_profile_data: {
          skills: person.skills || [],
          summary: person.summary || ''
        }
      };
    });

    const responseMessage = leads.length > 0 
      ? `Found ${leads.length} unique leads using simplified search strategies.`
      : 'No new leads found with the current search criteria. Try using different search terms.';

    return new Response(
      JSON.stringify({
        success: true,
        leads,
        total: leads.length,
        query: searchQuery,
        searchCriteria,
        message: responseMessage,
        strategiesUsed: searchCriteria.alt_searches ? ['primary', 'alternatives'] : ['primary'],
        existingLeadsExcluded: existingLeads.length,
        duplicatesAvoided: allLeads.length - leads.length
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
