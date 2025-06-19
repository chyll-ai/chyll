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
      job_company_industry: string;
      job_company_size: string;
      job_company_website: string;
      job_seniority: string;
      location_name: string;
      skills: string[];
      headline: string;
      summary: string;
      experience: Array<{
        company: { name: string; website?: string; industry?: string; size?: string };
        title: string;
        start_date: string;
        end_date?: string;
        description?: string;
        location?: string;
      }>;
      education: Array<{
        school: { name: string; type?: string };
        degrees: string[];
        start_date?: string;
        end_date?: string;
        gpa?: number;
      }>;
      certifications: Array<{
        name: string;
        organization: string;
        start_date?: string;
        end_date?: string;
      }>;
      languages: Array<{
        name: string;
        proficiency?: string;
      }>;
      github_url?: string;
      twitter_url?: string;
      facebook_url?: string;
      connections?: number;
      recommendations?: number;
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
  const fullName = person.full_name?.toLowerCase();
  const company = person.job_company_name?.toLowerCase();

  return existingLeads.some(existing => {
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
  } else if (queryLower.includes('product manager') || queryLower.includes('pm')) {
    searchCriteria.job_title = 'product manager';
  } else {
    searchCriteria.job_title = 'manager';
  }

  return searchCriteria;
}

async function searchPeopleWithPDL(searchParams: any, count: number = 10): Promise<PDLSearchResponse> {
  if (!PDL_API_KEY) {
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

  const sql = `SELECT * FROM person WHERE (${conditions.join(' AND ')})`;
  
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

function calculateExperienceYears(experience: any[]): number {
  if (!experience || experience.length === 0) return 0;
  
  let totalMonths = 0;
  experience.forEach(exp => {
    if (exp.start_date) {
      const startDate = new Date(exp.start_date);
      const endDate = exp.end_date ? new Date(exp.end_date) : new Date();
      const months = Math.max(0, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      totalMonths += months;
    }
  });
  
  return Math.round(totalMonths / 12);
}

function extractCompanySize(size: string | number): string {
  if (!size) return 'unknown';
  
  const sizeStr = size.toString().toLowerCase();
  if (sizeStr.includes('1-10') || sizeStr.includes('startup')) return 'startup';
  if (sizeStr.includes('11-50') || sizeStr.includes('small')) return 'small';
  if (sizeStr.includes('51-200') || sizeStr.includes('medium')) return 'medium';
  if (sizeStr.includes('201-1000') || sizeStr.includes('large')) return 'large';
  if (sizeStr.includes('1000+') || sizeStr.includes('enterprise')) return 'enterprise';
  
  return 'unknown';
}

function extractSeniority(title: string): string {
  if (!title) return 'unknown';
  
  const titleLower = title.toLowerCase();
  if (titleLower.includes('junior') || titleLower.includes('intern') || titleLower.includes('associate')) return 'junior';
  if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) return 'senior';
  if (titleLower.includes('director') || titleLower.includes('vp') || titleLower.includes('cto') || titleLower.includes('ceo')) return 'executive';
  
  return 'mid';
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

    if (!PDL_API_KEY) {
      throw new Error('PDL API key is not configured. Please configure your People Data Labs API key to use real data search.');
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

    // Perform PDL search
    const pdlResults = await searchPeopleWithPDL(searchCriteria, count);
    
    if (!pdlResults.data?.data) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No data returned from PDL API',
          leads: [],
          message: 'Aucun résultat trouvé pour cette recherche.'
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        }
      );
    }

    // Filter and transform PDL results with enhanced data
    const validPdlLeads = pdlResults.data.data.filter((person: any) => {
      // Must have at minimum a name and a company
      if (!person.full_name || !person.job_company_name) {
        console.log('Filtering out PDL result without basic info:', person);
        return false;
      }
      
      // Check if not duplicate based on name+company
      if (isExistingLead(person, existingLeads)) {
        return false;
      }
      
      return true;
    });
    
    console.log('Valid PDL leads:', validPdlLeads.length);
    
    // Transform PDL results to our enhanced lead format
    const leads = validPdlLeads.slice(0, count).map((person: any) => {
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
        email: person.emails?.[0]?.address || '',
        phone_number: person.phone_numbers?.[0]?.number || '',
        linkedin_url: person.linkedin_url || '',
        github_url: person.github_url || '',
        twitter_url: person.twitter_url || '',
        facebook_url: person.facebook_url || '',
        job_company_industry: person.job_company_industry || '',
        job_company_size: extractCompanySize(person.job_company_size),
        job_company_website: person.job_company_website || '',
        job_seniority: extractSeniority(person.job_title),
        experience_years: calculateExperienceYears(person.experience),
        headline: person.headline || '',
        summary: person.summary || '',
        skills: person.skills ? JSON.stringify(person.skills) : null,
        languages: person.languages ? JSON.stringify(person.languages) : null,
        education: person.education ? JSON.stringify(person.education) : null,
        certifications: person.certifications ? JSON.stringify(person.certifications) : null,
        status: 'new',
        created_at: new Date().toISOString(),
        enriched_from: {
          source: 'peopledatalabs',
          timestamp: new Date().toISOString(),
          query: searchQuery,
          parsed_criteria: searchCriteria,
          notes: 'Enhanced data from People Data Labs with company and social profiles'
        },
        linkedin_profile_data: {
          skills: person.skills || [],
          summary: person.summary || '',
          connections: person.connections || 0,
          recommendations: person.recommendations || 0,
          experience: person.experience || []
        }
      };
    });

    let responseMessage = '';
    
    if (leads.length === 0) {
      responseMessage = `Aucun nouveau lead trouvé pour "${searchQuery}". Essayez d'utiliser des termes différents ou élargissez vos critères de recherche.`;
      if (existingLeads.length > 0) {
        responseMessage += ` Note: ${existingLeads.length} leads existants ont été automatiquement exclus pour éviter les doublons.`;
      }
    } else {
      const withEmails = leads.filter(lead => lead.email).length;
      const withoutEmails = leads.length - withEmails;
      const withSocial = leads.filter(lead => lead.linkedin_url || lead.github_url || lead.twitter_url).length;
      responseMessage = `Excellent ! J'ai trouvé ${leads.length} profils enrichis via People Data Labs pour "${searchQuery}". ${withEmails} ont un email, ${withSocial} ont des profils sociaux, avec des données complètes sur l'entreprise et l'expérience.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        leads,
        total: leads.length,
        query: searchQuery,
        searchCriteria,
        message: responseMessage,
        usedDemoData: false,
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
        leads: [],
        message: errorMessage.includes('PDL API key') 
          ? 'Clé API People Data Labs manquante. Veuillez configurer votre clé API pour utiliser la recherche de données réelles.'
          : 'Erreur lors de la recherche PDL. Veuillez réessayer ou vérifier votre configuration.'
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
