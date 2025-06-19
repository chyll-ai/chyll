
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

interface EnrichmentRequest {
  leadId: string;
  email?: string;
  linkedin_url?: string;
  full_name?: string;
  company?: string;
}

interface PDLEnrichmentResponse {
  status: number;
  data?: {
    emails: Array<{ address: string; type: string }>;
    phone_numbers: Array<{ number: string; type: string }>;
    linkedin_url: string;
    job_title: string;
    job_company_name: string;
    location_name: string;
    skills: string[];
    experience: Array<{
      company: { name: string };
      title: { name: string };
      start_date: string;
      end_date: string;
    }>;
    education: Array<{
      school: { name: string };
      degrees: string[];
    }>;
    summary: string;
  };
  error?: string;
}

async function enrichPersonWithPDL(params: EnrichmentRequest): Promise<PDLEnrichmentResponse> {
  if (!PDL_API_KEY) {
    throw new Error('PDL_API_KEY is not configured');
  }

  const searchParams = new URLSearchParams();
  
  if (params.email) {
    searchParams.append('email', params.email);
  }
  if (params.linkedin_url) {
    searchParams.append('linkedin_url', params.linkedin_url);
  }
  if (params.full_name) {
    searchParams.append('name', params.full_name);
  }
  if (params.company) {
    searchParams.append('company', params.company);
  }

  console.log('PDL Enrichment request:', { leadId: params.leadId, searchParams: searchParams.toString() });

  const response = await fetch(`${PDL_BASE_URL}/person/enrich?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': PDL_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PDL API error:', response.status, errorText);
    throw new Error(`PDL API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('PDL enrichment successful for lead:', params.leadId);
  
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
    const { leadId, email, linkedin_url, full_name, company }: EnrichmentRequest = await req.json();

    if (!leadId) {
      throw new Error('Lead ID is required');
    }

    if (!email && !linkedin_url && !full_name) {
      throw new Error('At least one of email, LinkedIn URL, or full name is required');
    }

    const enrichmentResult = await enrichPersonWithPDL({
      leadId,
      email,
      linkedin_url,
      full_name,
      company
    });

    return new Response(
      JSON.stringify({
        success: true,
        leadId,
        enrichment: enrichmentResult.data
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in PDL enrichment function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage
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
