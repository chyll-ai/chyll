
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

  // More lenient duplicate detection
  return existingLeads.some(existing => {
    // Check email match (primary check)
    if (email && existing.email && existing.email.toLowerCase() === email) {
      console.log('Skipping duplicate email:', email);
      return true;
    }
    
    // Check name + company match (secondary check, more lenient)
    if (fullName && company && existing.full_name && existing.company) {
      const existingNameLower = existing.full_name.toLowerCase();
      const existingCompanyLower = existing.company.toLowerCase();
      
      if (existingNameLower === fullName && existingCompanyLower === company) {
        console.log('Skipping duplicate name+company:', fullName, company);
        return true;
      }
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

  const systemPrompt = `You are an expert at parsing job search queries for People Data Labs API.

Generate SIMPLE search parameters that work reliably with PDL. Use broader, more flexible terms.

Extract this information and return as JSON:

Primary search:
- job_title: Use broader terms (e.g., "manager" instead of "human resources manager")
- location: Use simpler format ("paris" instead of "paris, île-de-france, france")
- job_company_industry: Only if clearly specified

Alternative searches (2-3 SIMPLE alternatives):
- Use related job titles and broader locations

Rules:
- Keep job titles simple and broad
- Use city names only for locations
- Convert French terms to English
- Use lowercase
- Prioritize broad matches over exact matches

Example for "responsable rh à paris":
{
  "job_title": "manager",
  "location": "paris",
  "alt_searches": [
    {"job_title": "hr", "location": "paris"},
    {"job_title": "human resources", "location": "france"}
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

  // Basic location detection - use simple city names
  if (queryLower.includes('paris')) {
    searchCriteria.location = 'paris';
  } else if (queryLower.includes('lyon')) {
    searchCriteria.location = 'lyon';
  } else if (queryLower.includes('marseille')) {
    searchCriteria.location = 'marseille';
  } else if (queryLower.includes('toulouse')) {
    searchCriteria.location = 'toulouse';
  } else if (queryLower.includes('france')) {
    searchCriteria.location = 'france';
  }

  // Basic job title detection - use broader terms
  if (queryLower.includes('rh') || queryLower.includes('ressources humaines')) {
    searchCriteria.job_title = 'manager';
    searchCriteria.alt_searches = [
      { job_title: 'hr', location: searchCriteria.location },
      { job_title: 'human resources', location: searchCriteria.location }
    ];
  } else if (queryLower.includes('commercial') || queryLower.includes('sales')) {
    searchCriteria.job_title = 'sales';
    searchCriteria.alt_searches = [
      { job_title: 'business development', location: searchCriteria.location },
      { job_title: 'account manager', location: searchCriteria.location }
    ];
  } else if (queryLower.includes('communication')) {
    searchCriteria.job_title = 'marketing';
    searchCriteria.alt_searches = [
      { job_title: 'communications', location: searchCriteria.location },
      { job_title: 'brand', location: searchCriteria.location }
    ];
  } else if (queryLower.includes('développeur') || queryLower.includes('developer')) {
    searchCriteria.job_title = 'developer';
    searchCriteria.alt_searches = [
      { job_title: 'engineer', location: searchCriteria.location },
      { job_title: 'software', location: searchCriteria.location }
    ];
  } else {
    // Default fallback with broader terms
    searchCriteria.job_title = 'manager';
    searchCriteria.alt_searches = [
      { job_title: 'director', location: searchCriteria.location },
      { job_title: 'lead', location: searchCriteria.location }
    ];
  }

  return searchCriteria;
}

async function searchPeopleWithPDL(searchParams: any, count: number = 10): Promise<PDLSearchResponse> {
  if (!PDL_API_KEY) {
    throw new Error('PDL_API_KEY is not configured');
  }

  // Build more flexible SQL query using LIKE operators
  const conditions: string[] = [];
  
  if (searchParams.job_title) {
    const jobTitle = searchParams.job_title.replace(/'/g, "''");
    // Use LIKE for more flexible matching
    conditions.push(`job_title LIKE '%${jobTitle}%'`);
  }
  
  if (searchParams.location) {
    const location = searchParams.location.replace(/'/g, "''");
    // Use LIKE for more flexible location matching
    conditions.push(`location_name LIKE '%${location}%'`);
  }
  
  if (searchParams.job_company_industry) {
    const industry = searchParams.job_company_industry.replace(/'/g, "''");
    conditions.push(`job_company_industry LIKE '%${industry}%'`);
  }

  // Fallback to basic search if no conditions
  if (conditions.length === 0) {
    conditions.push(`job_title LIKE '%manager%'`);
  }

  // Construct more flexible SQL query
  const sql = `SELECT * FROM person WHERE (${conditions.join(' AND ')})`;
  
  const searchBody = {
    sql: sql,
    size: Math.min(count * 3, 100), // Request more to account for filtering
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
    console.log('PDL API response preview:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('PDL Search API error:', response.status, responseText);
      throw new Error(`PDL Search API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('PDL search successful, found:', data.data?.length || 0, 'results');
    
    // Log sample results for debugging
    if (data.data && data.data.length > 0) {
      console.log('Sample result structure:', JSON.stringify(data.data[0], null, 2));
    }
    
    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('Error in PDL search request:', error);
    throw error;
  }
}

async function performSearchWithProgressiveRelaxation(searchCriteria: any, count: number, existingLeads: ExistingLead[]): Promise<any[]> {
  const allLeads: any[] = [];
  const targetCount = count;
  const usedEmails = new Set<string>();
  
  // Helper function to process and filter results
  const processResults = (results: any[]) => {
    const newLeads: any[] = [];
    
    for (const person of results) {
      // Check if person has required data
      if (!person.emails?.[0]?.address) {
        console.log('Skipping person without email:', person.full_name);
        continue;
      }
      
      const email = person.emails[0].address.toLowerCase();
      
      // Skip if email already processed
      if (usedEmails.has(email)) {
        console.log('Skipping duplicate email in results:', email);
        continue;
      }
      
      // Skip if exists in user's leads (more lenient check)
      if (isExistingLead(person, existingLeads)) {
        continue;
      }
      
      usedEmails.add(email);
      newLeads.push(person);
      
      console.log('Added new lead:', person.full_name, email);
      
      if (newLeads.length >= targetCount) break;
    }
    
    return newLeads;
  };

  // Try primary search first
  try {
    console.log('Trying primary search:', searchCriteria);
    const primaryResults = await searchPeopleWithPDL(searchCriteria, targetCount * 2);
    
    if (primaryResults.data?.data) {
      const newLeads = processResults(primaryResults.data.data);
      allLeads.push(...newLeads);
      console.log('Primary search found:', newLeads.length, 'valid leads');
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
        const altResults = await searchPeopleWithPDL(altSearch, targetCount * 2);
        
        if (altResults.data?.data) {
          const newLeads = processResults(altResults.data.data);
          allLeads.push(...newLeads);
          console.log('Alternative search found:', newLeads.length, 'new valid leads');
        }
      } catch (error) {
        console.error('Alternative search failed:', error);
        continue;
      }
    }
  }

  // If still no results, try very broad searches
  if (allLeads.length === 0) {
    console.log('No results found, trying broader searches...');
    
    const broadSearches = [
      { job_title: 'manager', location: 'france' },
      { job_title: 'director', location: 'france' },
      { job_title: 'manager' } // Location-agnostic
    ];
    
    for (const broadSearch of broadSearches) {
      if (allLeads.length >= targetCount) break;
      
      try {
        console.log('Trying broad search:', broadSearch);
        const broadResults = await searchPeopleWithPDL(broadSearch, targetCount * 2);
        
        if (broadResults.data?.data) {
          const newLeads = processResults(broadResults.data.data);
          allLeads.push(...newLeads);
          console.log('Broad search found:', newLeads.length, 'new valid leads');
          
          if (newLeads.length > 0) break; // Stop after first successful broad search
        }
      } catch (error) {
        console.error('Broad search failed:', error);
        continue;
      }
    }
  }

  // Return up to the requested count
  const finalLeads = allLeads.slice(0, targetCount);
  console.log('Total leads after progressive search:', finalLeads.length);
  
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

    // Get existing leads for deduplication
    const existingLeads = await getExistingLeads(userId);
    console.log('Found', existingLeads.length, 'existing leads to exclude');

    // Parse the search query
    const searchCriteria = await parseSearchQueryWithOpenAI(searchQuery);
    
    // Apply additional filters if provided
    if (filters) {
      Object.assign(searchCriteria, filters);
    }

    console.log('Final search criteria:', searchCriteria);

    // Perform search with progressive relaxation
    const allLeads = await performSearchWithProgressiveRelaxation(searchCriteria, count, existingLeads);

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
          search_strategy: 'progressive_relaxation'
        },
        linkedin_profile_data: {
          skills: person.skills || [],
          summary: person.summary || ''
        }
      };
    });

    const responseMessage = leads.length > 0 
      ? `Found ${leads.length} unique leads using progressive search relaxation.`
      : 'No leads found with the current search criteria. The search has been attempted with multiple strategies.';

    return new Response(
      JSON.stringify({
        success: true,
        leads,
        total: leads.length,
        query: searchQuery,
        searchCriteria,
        message: responseMessage,
        strategiesUsed: ['primary', 'alternatives', 'progressive_relaxation'],
        existingLeadsExcluded: existingLeads.length
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
