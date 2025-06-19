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
    if (email && existing.email && existing.email.toLowerCase() === email) {
      console.log('Skipping duplicate email:', email);
      return true;
    }
    
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

function generateDemoLeads(searchQuery: string, requestedCount: number = 5): any[] {
  console.log('Generating demo leads for:', searchQuery, 'count:', requestedCount);
  
  const techCompanies = [
    'Schneider Electric', 'Thales', 'Capgemini', 'Atos', 'Dassault Systèmes', 
    'Orange', 'BNP Paribas', 'Société Générale', 'L\'Oréal', 'LVMH',
    'Sanofi', 'Total Energies', 'Carrefour', 'Renault', 'PSA Group'
  ];
  
  const frenchFirstNames = ['Alexandre', 'Sophie', 'Julien', 'Marine', 'Thomas', 'Camille', 'Nicolas', 'Amélie', 'Pierre', 'Claire'];
  const frenchLastNames = ['Martin', 'Dubois', 'Moreau', 'Lefebvre', 'Garcia', 'Roux', 'Fournier', 'Girard', 'Bernard', 'Durand'];
  const frenchCities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille'];
  
  // Parse search query for job title hints
  const queryLower = searchQuery.toLowerCase();
  let jobTitle = 'Manager';
  
  if (queryLower.includes('rh') || queryLower.includes('ressources humaines')) {
    jobTitle = 'Responsable RH';
  } else if (queryLower.includes('commercial') || queryLower.includes('sales')) {
    jobTitle = 'Responsable Commercial';
  } else if (queryLower.includes('marketing')) {
    jobTitle = 'Responsable Marketing';
  } else if (queryLower.includes('dev') || queryLower.includes('développeur')) {
    jobTitle = 'Développeur Senior';
  }

  const leads: any[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < requestedCount; i++) {
    const firstName = frenchFirstNames[Math.floor(Math.random() * frenchFirstNames.length)];
    const lastName = frenchLastNames[Math.floor(Math.random() * frenchLastNames.length)];
    const company = techCompanies[Math.floor(Math.random() * techCompanies.length)];
    const city = frenchCities[Math.floor(Math.random() * frenchCities.length)];
    
    let email: string;
    let attempts = 0;
    do {
      const emailSuffix = attempts > 0 ? (attempts + 1).toString() : '';
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailSuffix}@${company.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.fr`;
      attempts++;
    } while (usedEmails.has(email) && attempts < 10);
    
    usedEmails.add(email);
    
    const lead = {
      id: crypto.randomUUID(),
      client_id: '',
      full_name: `${firstName} ${lastName}`,
      job_title: jobTitle,
      company: company,
      location: city,
      email: email,
      phone_number: `+33 6${Math.floor(Math.random() * 90000000) + 10000000}`,
      linkedin_url: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
      status: 'new',
      created_at: new Date().toISOString(),
      enriched_from: {
        source: 'demo_data',
        timestamp: new Date().toISOString(),
        notes: `Generated from search: "${searchQuery}"`
      }
    };
    
    leads.push(lead);
  }

  console.log('Generated demo leads:', leads.length);
  return leads;
}

async function parseSearchQueryWithOpenAI(query: string): Promise<any> {
  // Simplified parsing - focus on demo data generation
  const searchCriteria: any = {};
  const queryLower = query.toLowerCase();

  if (queryLower.includes('paris')) {
    searchCriteria.location = 'paris';
  } else if (queryLower.includes('lyon')) {
    searchCriteria.location = 'lyon';
  } else if (queryLower.includes('france')) {
    searchCriteria.location = 'france';
  }

  if (queryLower.includes('rh') || queryLower.includes('ressources humaines')) {
    searchCriteria.job_title = 'hr';
  } else if (queryLower.includes('commercial') || queryLower.includes('sales')) {
    searchCriteria.job_title = 'sales';
  } else if (queryLower.includes('développeur') || queryLower.includes('developer')) {
    searchCriteria.job_title = 'developer';
  } else {
    searchCriteria.job_title = 'manager';
  }

  return searchCriteria;
}

async function searchPeopleWithPDL(searchParams: any, count: number = 10): Promise<PDLSearchResponse> {
  if (!PDL_API_KEY) {
    console.log('PDL_API_KEY not configured, will use demo data');
    throw new Error('PDL_API_KEY is not configured');
  }

  const conditions: string[] = [];
  
  if (searchParams.job_title) {
    const jobTitle = searchParams.job_title.replace(/'/g, "''");
    conditions.push(`job_title LIKE '%${jobTitle}%'`);
  }
  
  if (searchParams.location) {
    const location = searchParams.location.replace(/'/g, "''");
    conditions.push(`location_name LIKE '%${location}%'`);
  }

  if (conditions.length === 0) {
    conditions.push(`job_title LIKE '%manager%'`);
  }

  const sql = `SELECT * FROM person WHERE (${conditions.join(' AND ')}) AND emails IS NOT NULL`;
  
  const searchBody = {
    sql: sql,
    size: Math.min(count * 2, 50),
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
      
      // Check if it's a payment error
      if (response.status === 402) {
        console.log('PDL account limit reached, falling back to demo data');
        throw new Error('PDL_PAYMENT_REQUIRED');
      }
      
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

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery, userId, count = 5, filters }: SearchRequest = await req.json();

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

    console.log('Search criteria:', searchCriteria);

    let leads: any[] = [];
    let usedDemoData = false;
    let pdlError = null;

    // Try PDL search first
    try {
      const pdlResults = await searchPeopleWithPDL(searchCriteria, count);
      
      if (pdlResults.data?.data) {
        // Filter PDL results - only keep those with emails
        const validPdlLeads = pdlResults.data.data.filter((person: any) => {
          // Must have email
          if (!person.emails?.[0]?.address) {
            console.log('Filtering out PDL result without email:', person.full_name);
            return false;
          }
          
          // Check if not duplicate
          if (isExistingLead(person, existingLeads)) {
            return false;
          }
          
          return true;
        });
        
        console.log('Valid PDL leads with emails:', validPdlLeads.length);
        
        // Transform PDL results to our lead format
        leads = validPdlLeads.slice(0, count).map((person: any) => {
          let location = 'Unknown';
          
          if (typeof person.location_name === 'string' && person.location_name.trim()) {
            location = person.location_name;
          } else if (typeof person.location_country === 'string' && person.location_country.trim()) {
            location = person.location_country;
          }
          
          return {
            id: crypto.randomUUID(),
            client_id: userId,
            full_name: person.full_name || 'N/A',
            job_title: person.job_title || 'N/A',
            company: person.job_company_name || 'N/A',
            location: location,
            email: person.emails[0].address,
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
          };
        });
      }
    } catch (error) {
      console.error('PDL search failed:', error);
      pdlError = error.message;
      usedDemoData = true;
    }

    // If PDL failed or returned no valid results, use demo data
    if (leads.length === 0) {
      console.log('No valid PDL results, generating demo data');
      usedDemoData = true;
      
      const demoLeads = generateDemoLeads(searchQuery, count);
      leads = demoLeads.map(lead => ({
        ...lead,
        client_id: userId
      }));
    }

    let responseMessage = '';
    
    if (usedDemoData) {
      if (pdlError?.includes('PDL_PAYMENT_REQUIRED')) {
        responseMessage = `Votre compte People Data Labs a atteint sa limite. J'ai généré ${leads.length} leads de démonstration pour "${searchQuery}". Pour utiliser de vraies données, veuillez recharger votre compte PDL.`;
      } else {
        responseMessage = `J'ai généré ${leads.length} leads de démonstration pour "${searchQuery}". Pour utiliser de vraies données, vérifiez votre configuration PDL.`;
      }
    } else {
      responseMessage = `Excellent ! J'ai trouvé ${leads.length} leads réels avec emails via People Data Labs pour "${searchQuery}".`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        leads,
        total: leads.length,
        query: searchQuery,
        searchCriteria,
        message: responseMessage,
        usedDemoData,
        pdlError,
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
