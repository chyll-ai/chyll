// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

interface RequestEvent {
  method: string;
  headers: Headers;
  json: () => Promise<any>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const VALID_STATUSES = [
  'à contacter',
  'email envoyé',
  'répondu',
  'à relancer',
  'appel prévu',
  'RDV',
  'RDV manqué'
];

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

serve(async (req: RequestEvent) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { lead_id, status, user_id } = await req.json();

    // Validate required fields
    if (!lead_id || !status || !user_id) {
      return new Response(
        JSON.stringify({ error: 'lead_id, status, and user_id are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate status
    const normalizedStatus = status.toLowerCase().trim();
    const validStatus = VALID_STATUSES.find(s => s.toLowerCase() === normalizedStatus) || 
                       VALID_STATUSES.find(s => normalizedStatus.includes(s.toLowerCase()));

    if (!validStatus) {
      return new Response(
        JSON.stringify({ error: `Invalid status. Valid statuses are: ${VALID_STATUSES.join(', ')}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the lead belongs to the user
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('id, full_name, status')
      .eq('id', lead_id)
      .eq('client_id', user_id)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found or unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Update the lead status
    const { error: updateError } = await supabaseClient
      .from('leads')
      .update({ status: validStatus })
      .eq('id', lead_id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        message: `Status updated to ${validStatus}`,
        lead: {
          id: lead.id,
          name: lead.full_name,
          status: validStatus
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
}); 