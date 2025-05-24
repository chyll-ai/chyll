// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Allow all origins in development
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

interface SearchLeadsRequest {
  user_id: string;
  query: string;
  criteria: {
    name?: string;
    company?: string;
    job_title?: string;
    Statut?: string;
    email?: string;
    has_email_jobs?: boolean;
    created_after?: string;
    created_before?: string;
  };
}

interface Lead {
  id: string;
  full_name: string;
  company: string;
  job_title: string;
  email: string;
  Statut: string;
  created_at: string;
  email_jobs?: {
    status: string;
    sent_at: string;
    subject: string;
    body: string;
  }[];
}

const VALID_STATUSES = [
  'new',
  'à contacter',
  'email envoyé',
  'répondu',
  'à relancer',
  'appel prévu',
  'RDV',
  'RDV manqué'
];

// Add common patterns for natural language processing
const QUERY_PATTERNS = {
  followup: [
    /follow.?up/i,
    /relancer/i,
    /à relancer/i,
  ],
  company: [
    /chez\s+([^?\s]+)/i,
    /travaille\s+(?:chez|pour)\s+([^?\s]+)/i,
    /bosse\s+(?:chez|pour)\s+([^?\s]+)/i,
    /employés?\s+(?:chez|de)\s+([^?\s]+)/i,
    /dans\s+l'entreprise\s+([^?\s]+)/i,
    /dans\s+la\s+société\s+([^?\s]+)/i
  ],
  ceo: [
    /\b(ceo|pdg|dg)\b/i,
    /chief.?executive/i,
    /président/i,
    /directeur.?général/i,
    /directeur.?general/i,
    /directeur/i
  ],
  cto: [
    /\b(cto|dt)\b/i,
    /chief.?tech/i,
    /directeur.?tech/i,
    /directeur.?informatique/i,
    /dsi/i
  ],
  cfo: [
    /\b(cfo|daf)\b/i,
    /chief.?financial/i,
    /directeur.?financier/i,
    /directeur.?finance/i
  ],
  vp: [
    /\b(vp|dvp)\b/i,
    /vice.?pr[ée]sident/i,
    /directeur.?ventes/i,
    /directeur.?commercial/i
  ],
  founder: [
    /\b(founder|fondateur)\b/i,
    /co.?found/i,
    /co.?fond/i,
    /créateur/i,
    /fondatrice/i
  ],
  status: {
    'new': [/new/i, /nouveau/i, /nouveaux/i],
    'à contacter': [
      /à\s+contacter/i,
      /qui\s+est\s+à\s+contacter/i,
      /contact/i,
      /contacter/i,
      /à\s+contact/i
    ],
    'email envoyé': [/email.?envoyé/i, /sent/i],
    'répondu': [/répondu/i, /responded/i],
    'à relancer': [/relancer/i, /follow.?up/i],
    'appel prévu': [/appel.?prévu/i, /call.?scheduled/i],
    'RDV': [/rdv/i, /meeting/i],
    'RDV manqué': [/rdv.?manqué/i, /missed/i]
  },
  time: {
    today: [/today/i, /aujourd'hui/i, /auj/i],
    week: [/this.?week/i, /cette.?semaine/i],
    month: [/this.?month/i, /ce.?mois/i],
    recent: [/recent/i, /récent/i]
  }
};

function normalizeStatus(status: string): string {
  if (!status) return 'new';
  
  // Convert to lowercase and trim
  const normalized = status.toLowerCase().trim();
  
  // Handle special cases first
  if (normalized === 'new' || normalized === 'nouveau') return 'new';
  if (normalized === 'à contacter' || normalized === 'a contacter') return 'à contacter';
  if (normalized === 'à relancer' || normalized === 'a relancer') return 'à relancer';
  if (normalized === 'rdv manqué') return 'RDV manqué';
  if (normalized === 'rdv') return 'RDV';
  
  // Try exact match first (case insensitive)
  const exactMatch = VALID_STATUSES.find(s => 
    s.toLowerCase() === normalized ||
    s.toLowerCase().replace(/[àáâãäå]/g, 'a') === normalized.replace(/[àáâãäå]/g, 'a')
  );
  if (exactMatch) return exactMatch;
  
  // Try partial match
  const partialMatch = VALID_STATUSES.find(s => {
    const normalizedValidStatus = s.toLowerCase().replace(/[àáâãäå]/g, 'a');
    const normalizedInput = normalized.replace(/[àáâãäå]/g, 'a');
    return normalizedValidStatus === normalizedInput;
  });
  if (partialMatch) return partialMatch;
  
  return 'new';
}

function parseNaturalLanguageQuery(query: string): any {
  const criteria: any = {};
  
  // Convert query to lowercase and trim
  const lowerQuery = query.toLowerCase().trim();

  // Simple status check
  if (lowerQuery === 'à contacter' || 
      lowerQuery === 'a contacter' ||
      lowerQuery.includes('à contacter') || 
      lowerQuery.includes('a contacter') ||
      /leads?\s+(?:à|a)\s+contacter/.test(lowerQuery) ||
      /qui\s+(?:sont|est)\s+(?:mes|les)\s+leads?\s+(?:à|a)\s+contacter/.test(lowerQuery)) {
    criteria.Statut = 'à contacter';
    return criteria;
  }

  // Only check job titles if no status was found
  if (lowerQuery.includes('ceo') || lowerQuery.includes('pdg')) {
    criteria.job_title = 'CEO';
  } else if (lowerQuery.includes('cto')) {
    criteria.job_title = 'CTO';
  }

  return criteria;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    const { user_id, query, criteria: requestCriteria } = await req.json() as SearchLeadsRequest;

    // Verify the authenticated user matches the requested user_id
    if (user.id !== user_id) {
      throw new Error('Unauthorized access');
    }

    console.log('Processing query:', query);
    // Parse natural language query
    const nlpCriteria = parseNaturalLanguageQuery(query);
    console.log('NLP criteria:', nlpCriteria);
    
    // Merge NLP criteria with request criteria (request takes precedence)
    const searchCriteria = { ...nlpCriteria, ...requestCriteria };
    console.log('Final search criteria:', searchCriteria);

    // Start building the query
    let dbQuery = supabase
      .from('leads')
      .select(`
        *,
        email_jobs (
          status,
          sent_at,
          subject,
          body
        )
      `)
      .eq('client_id', user_id);

    // If we're searching for status, that's all we need
    if (searchCriteria.Statut) {
      console.log('Searching for leads with status:', searchCriteria.Statut);
      dbQuery = dbQuery.eq('Statut', searchCriteria.Statut);
    } 
    // Otherwise apply other filters
    else {
      if (searchCriteria.name) {
        dbQuery = dbQuery.ilike('full_name', `%${searchCriteria.name}%`);
      }
      if (searchCriteria.job_title) {
        dbQuery = dbQuery.ilike('job_title', `%${searchCriteria.job_title}%`);
      }
      if (searchCriteria.email) {
        dbQuery = dbQuery.ilike('email', `%${searchCriteria.email}%`);
      }
    }

    // Add sorting
    dbQuery = dbQuery.order('created_at', { ascending: false });

    // Execute the query
    const { data: leads, error } = await dbQuery;

    if (error) throw error;

    console.log(`Found ${leads?.length || 0} leads with criteria:`, searchCriteria);

    // Filter by email_jobs if needed
    let filteredLeads = leads;
    if (searchCriteria.has_email_jobs !== undefined) {
      filteredLeads = leads.filter((lead: Lead) => {
        const hasEmailJobs = lead.email_jobs && lead.email_jobs.length > 0;
        return searchCriteria.has_email_jobs ? hasEmailJobs : !hasEmailJobs;
      });
    }

    // Group leads by status for better organization
    const groupedByStatus = filteredLeads.reduce((acc: any, lead: Lead) => {
      const status = lead.Statut || 'Non défini';
      acc[status] = acc[status] || [];
      acc[status].push(lead);
      return acc;
    }, {});

    // Prepare response message
    let message = '';
    if (filteredLeads && filteredLeads.length > 0) {
      if (searchCriteria.job_title) {
        message = `Found ${filteredLeads.length} leads with job title matching "${searchCriteria.job_title}"`;
      } else if (searchCriteria.Statut) {
        message = `Found ${filteredLeads.length} leads with status "${searchCriteria.Statut}"`;
      } else {
        message = `Found ${filteredLeads.length} leads`;
      }
    } else {
      if (searchCriteria.job_title) {
        message = `No leads found with job title matching "${searchCriteria.job_title}"`;
      } else if (searchCriteria.Statut) {
        message = `No leads found with status "${searchCriteria.Statut}". This might be due to case sensitivity or accent differences. Please check the status value in your database.`;
      } else {
        message = `No leads found matching your criteria`;
      }
    }

    return new Response(
      JSON.stringify({
        message,
        total: filteredLeads.length,
        leads: filteredLeads,
        criteria: searchCriteria,
        debug: {
          normalizedStatus: searchCriteria.Statut ? normalizeStatus(searchCriteria.Statut) : null,
          query: searchCriteria
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred during the search',
      }),
      {
        status: error.message.includes('authorization') ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 