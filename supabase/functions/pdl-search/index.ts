
// @ts-ignore: Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

const PDL_API_KEY = Deno.env.get('PDL_API_KEY');
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

function parseSearchQuery(query: string): any {
  const searchCriteria: any = {};
  const queryLower = query.toLowerCase();

  // Extract job titles
  const jobTitlePatterns = [
    { pattern: /(?:vp|vice president|vice-président).*(?:sales|commercial)/i, title: 'VP Sales' },
    { pattern: /(?:director|directeur).*(?:sales|commercial)/i, title: 'Sales Director' },
    { pattern: /(?:head of|chef).*(?:sales|ventes)/i, title: 'Head of Sales' },
    { pattern: /(?:sales manager|responsable commercial)/i, title: 'Sales Manager' },
    { pattern: /(?:business developer|développeur commercial)/i, title: 'Business Developer' },
    { pattern: /(?:cto|chief technical officer|directeur technique)/i, title: 'CTO' },
    { pattern: /(?:ceo|chief executive officer|directeur général)/i, title: 'CEO' },
    { pattern: /(?:product manager|chef de produit)/i, title: 'Product Manager' },
    { pattern: /(?:marketing manager|responsable marketing)/i, title: 'Marketing Manager' },
    { pattern: /(?:lead developer|développeur principal)/i, title: 'Lead Developer' }
  ];

  for (const { pattern, title } of jobTitlePatterns) {
    if (pattern.test(queryLower)) {
      searchCriteria.job_title = title;
      break;
    }
  }

  // Extract locations
  const locationPatterns = [
    'paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 
    'montpellier', 'strasbourg', 'bordeaux', 'lille', 'france'
  ];
  
  for (const location of locationPatterns) {
    if (queryLower.includes(location)) {
      searchCriteria.location_country = location === 'france' ? 'france' : null;
      if (location !== 'france') {
        searchCriteria.location_region = location;
      }
      break;
    }
  }

  // Extract industries
  if (queryLower.includes('tech') || queryLower.includes('technolog')) {
    searchCriteria.job_company_industry = 'technology';
  } else if (queryLower.includes('saas')) {
    searchCriteria.job_company_industry = 'computer software';
  } else if (queryLower.includes('finance')) {
    searchCriteria.job_company_industry = 'financial services';
  }

  return searchCriteria;
}

async function searchPeopleWithPDL(searchParams: any, count: number = 10): Promise<PDLSearchResponse> {
  if (!PDL_API_KEY) {
    throw new Error('PDL_API_KEY is not configured');
  }

  const searchBody = {
    query: searchParams,
    size: Math.min(count, 100), // PDL has limits
    dataset: 'person'
  };

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

    // Parse the natural language search query
    const searchCriteria = parseSearchQuery(searchQuery);
    
    // Apply additional filters if provided
    if (filters) {
      Object.assign(searchCriteria, filters);
    }

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
        query: searchQuery
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
