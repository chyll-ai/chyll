
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
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase configuration');
      return new Set();
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=email&client_id=eq.${userId}`, {
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const emails = new Set(data.map((lead: any) => lead.email?.toLowerCase()).filter(Boolean));
      console.log('Found existing lead emails:', emails.size, 'emails');
      return emails;
    } else {
      console.error('Failed to fetch existing leads:', response.status, await response.text());
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

Your goal is to generate MULTIPLE search variations to avoid duplicate results and find diverse candidates from different backgrounds, companies, and experiences.

IMPORTANT: Generate searches that will return DIFFERENT people, not the same profiles. Use these diversification strategies:
- Different job title variations and synonyms
- Different industries within the same function
- Different company sizes and types
- Different seniority levels
- Skills-based searches as alternatives
- Related but distinct roles

For communication/marketing roles, use these diverse alternatives:
- "marketing manager" vs "communications specialist" vs "brand manager" vs "digital marketing manager"
- "content creator" vs "social media manager" vs "marketing coordinator"
- Include industry variations: tech, healthcare, finance, retail, etc.

For RH/HR roles, use:
- "human resources manager" vs "talent acquisition" vs "people operations" vs "hr business partner"
- "recruiter" vs "hr generalist" vs "people & culture"

For commercial/sales roles, use:
- "sales manager" vs "business development" vs "account manager" vs "sales director"
- "commercial director" vs "key account manager" vs "sales representative"

Extract the following information and return as JSON with MULTIPLE diverse search strategies:

Primary search strategy:
- job_title: The main job title
- location_name: Full location format like "city, region, country" 
- job_company_industry: Industry sector (vary this across searches)
- job_seniority: Seniority level

Alternative search strategies (provide 3-4 VERY different alternatives):
- alt_searches: Array of alternative search objects with significantly different:
  - Job titles (use synonyms, related roles, different seniority)
  - Industries (tech vs healthcare vs finance vs retail)
  - Company size focus (startup vs enterprise)
  - Skills-based searches instead of job titles

Rules:
- For French locations, use full format: "paris, île-de-france, france"
- Convert French terms to English equivalents
- Use lowercase for all values
- Make alternatives SIGNIFICANTLY different to find different people
- Vary industries across searches to get diverse candidates
- Include both specific and broader role variations
- Return only JSON, no other text

Example for "communication à paris":
{
  "job_title": "marketing manager",
  "location_name": "paris, île-de-france, france",
  "job_company_industry": "technology",
  "alt_searches": [
    {"job_title": "communications specialist", "location_name": "paris, île-de-france, france", "job_company_industry": "healthcare"},
    {"job_title": "brand manager", "location_name": "paris, île-de-france, france", "job_company_industry": "finance", "job_seniority": "senior"},
    {"job_title": "digital marketing", "location_name": "paris, île-de-france, france", "job_company_industry": "retail"},
    {"job_title": "content manager", "location_name": "paris, île-de-france, france", "job_company_industry": "consulting", "job_seniority": "mid"}
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Parse this search query and generate diverse search strategies: "${query}"` }
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const searchCriteria = JSON.parse(responseContent);
    console.log('OpenAI parsed search criteria with diversity:', searchCriteria);
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
      { job_title: 'talent acquisition', location_name: searchCriteria.location_name, job_company_industry: 'technology' },
      { job_title: 'hr business partner', location_name: searchCriteria.location_name, job_company_industry: 'finance' },
      { job_title: 'people operations', location_name: searchCriteria.location_name, job_company_industry: 'healthcare' }
    ];
  } else if (queryLower.includes('commercial') || queryLower.includes('sales')) {
    searchCriteria.job_title = 'sales manager';
    searchCriteria.alt_searches = [
      { job_title: 'business development', location_name: searchCriteria.location_name, job_company_industry: 'technology' },
      { job_title: 'account manager', location_name: searchCriteria.location_name, job_company_industry: 'consulting' },
      { job_title: 'sales director', location_name: searchCriteria.location_name, job_company_industry: 'manufacturing' }
    ];
  } else if (queryLower.includes('communication')) {
    searchCriteria.job_title = 'marketing manager';
    searchCriteria.alt_searches = [
      { job_title: 'communications specialist', location_name: searchCriteria.location_name, job_company_industry: 'healthcare' },
      { job_title: 'brand manager', location_name: searchCriteria.location_name, job_company_industry: 'retail' },
      { job_title: 'digital marketing', location_name: searchCriteria.location_name, job_company_industry: 'finance' }
    ];
  } else if (queryLower.includes('développeur') || queryLower.includes('developer')) {
    searchCriteria.job_title = 'software developer';
    searchCriteria.alt_searches = [
      { job_title: 'software engineer', location_name: searchCriteria.location_name, job_company_industry: 'technology' },
      { job_title: 'frontend developer', location_name: searchCriteria.location_name, job_company_industry: 'fintech' },
      { job_title: 'full stack developer', location_name: searchCriteria.location_name, job_company_industry: 'startup' }
    ];
  } else if (queryLower.includes('cto')) {
    searchCriteria.job_title = 'cto';
    searchCriteria.job_company_industry = 'technology';
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

  // Exclude existing emails - IMPROVED LOGIC
  if (excludeEmails.size > 0) {
    const emailExclusions = Array.from(excludeEmails)
      .map(email => `'${email.toLowerCase()}'`)
      .join(',');
    conditions.push(`NOT EXISTS (SELECT 1 FROM UNNEST(emails) AS email WHERE LOWER(email->>'address') IN (${emailExclusions}))`);
  }

  // Default to searching for managers if no conditions
  if (conditions.length === 0) {
    conditions.push(`job_title = 'manager'`);
  }

  // Construct the SQL query - request more results to account for filtering
  const sql = `SELECT * FROM person WHERE (${conditions.join(' AND ')})`;
  
  const searchBody = {
    sql: sql,
    size: Math.min(count * 3, 100), // Request 3x more to account for duplicates
    pretty: true
  };

  console.log('PDL Search request with enhanced SQL:', JSON.stringify(searchBody, null, 2));

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

async function performDiversifiedSearch(searchCriteria: any, count: number, excludeEmails: Set<string>): Promise<any[]> {
  const allLeads: any[] = [];
  const targetCount = count;
  const usedEmails = new Set<string>();
  
  // Try primary search first
  try {
    console.log('Trying primary search:', searchCriteria);
    const primaryResults = await searchPeopleWithPDL(searchCriteria, Math.ceil(targetCount / 2), excludeEmails);
    if (primaryResults.data?.data) {
      // Filter out duplicates and existing emails
      const filteredResults = primaryResults.data.data.filter(person => {
        const email = person.emails?.[0]?.address?.toLowerCase();
        if (!email || excludeEmails.has(email) || usedEmails.has(email)) {
          return false;
        }
        usedEmails.add(email);
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
        const combinedExclusions = new Set([...excludeEmails, ...usedEmails]);
        const altResults = await searchPeopleWithPDL(altSearch, remainingCount * 2, combinedExclusions);
        
        if (altResults.data?.data) {
          // Filter out duplicates by email
          const newLeads = altResults.data.data.filter(person => {
            const email = person.emails?.[0]?.address?.toLowerCase();
            if (!email || excludeEmails.has(email) || usedEmails.has(email)) {
              return false;
            }
            usedEmails.add(email);
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

  // Final deduplication check
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

    // Get existing lead emails to avoid duplicates - ENHANCED
    const existingEmails = await getExistingLeadEmails(userId);
    console.log('Found', existingEmails.size, 'existing lead emails to exclude');

    // Use OpenAI to intelligently parse the search query with enhanced diversification
    const searchCriteria = await parseSearchQueryWithOpenAI(searchQuery, existingEmails);
    
    // Apply additional filters if provided
    if (filters) {
      Object.assign(searchCriteria, filters);
    }

    console.log('Final search criteria with diversification:', searchCriteria);

    // Perform diversified search with multiple strategies and enhanced duplicate prevention
    const allLeads = await performDiversifiedSearch(searchCriteria, count, existingEmails);

    // Transform PDL results to our lead format with enhanced location handling
    const leads = allLeads.map((person: any) => {
      // Enhanced location extraction with better fallbacks
      let location = 'Unknown';
      
      if (typeof person.location_name === 'string' && person.location_name.trim()) {
        location = person.location_name;
      } else if (typeof person.location_country === 'string' && person.location_country.trim()) {
        location = person.location_country;
      } else if (person.job_company_location_name && typeof person.job_company_location_name === 'string') {
        location = person.job_company_location_name;
      } else if (person.experience && person.experience.length > 0) {
        // Try to get location from current job experience
        const currentJob = person.experience.find((exp: any) => exp.is_primary) || person.experience[0];
        if (currentJob?.location_names && currentJob.location_names.length > 0) {
          location = currentJob.location_names[0];
        }
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
          search_strategy: 'enhanced_diversified'
        },
        linkedin_profile_data: {
          skills: person.skills || [],
          summary: person.summary || ''
        }
      };
    });

    // Count how many existing leads would have been duplicates
    const wouldBeDuplicates = allLeads.length > 0 ? Math.max(0, allLeads.length - leads.length) : 0;

    const responseMessage = leads.length > 0 
      ? `Found ${leads.length} diverse, unique leads using enhanced search strategies.`
      : allLeads.length === 0 
        ? 'No new leads found with the current search criteria. Try using different search terms.'
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
        existingLeadsExcluded: existingEmails.size,
        duplicatesAvoided: wouldBeDuplicates
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
