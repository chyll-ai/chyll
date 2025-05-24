// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

interface RequestEvent {
  method: string;
  headers: Headers;
  json: () => Promise<any>;
}

interface Lead {
  id: string;
  full_name: string;
  company: string;
  status: string;
}

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

interface ChatActionRequest {
  lead_id?: string;
  lead_name?: string;
  action: 'update_status' | 'send_cold_email' | 'send_followup' | 'schedule_call' | 'find_lead';
  status?: string;
  user_id: string;
  notes?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
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

serve(async (req: RequestEvent) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 // Explicitly set 200 status for OPTIONS
    });
  }

  try {
    const { lead_id, lead_name, action, status, user_id, notes } = await req.json() as ChatActionRequest;

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // If lead_name is provided, find the lead by name
    let lead: Lead | null = null;
    if (lead_name && !lead_id) {
      const { data: foundLeads, error: searchError } = await supabaseClient
        .from('leads')
        .select('*')
        .eq('client_id', user_id)
        .ilike('full_name', `%${lead_name}%`)
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;

      if (!foundLeads || foundLeads.length === 0) {
        return new Response(
          JSON.stringify({ error: `Lead "${lead_name}" not found` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      if (foundLeads.length > 1) {
        return new Response(
          JSON.stringify({ 
            error: 'Multiple leads found with this name',
            leads: foundLeads.map((l: Lead) => ({ id: l.id, name: l.full_name, company: l.company }))
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 300 }
        );
      }

      lead = foundLeads[0];
    } else if (lead_id) {
      // Verify the lead belongs to the user
      const { data: foundLead, error: leadError } = await supabaseClient
        .from('leads')
        .select('*')
        .eq('id', lead_id)
        .eq('client_id', user_id)
        .single();

      if (leadError || !foundLead) {
        return new Response(
          JSON.stringify({ error: 'Lead not found or unauthorized' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      lead = foundLead;
    } else {
      return new Response(
        JSON.stringify({ error: 'Either lead_id or lead_name must be provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // At this point, lead should never be null due to our previous checks
    if (!lead) {
      throw new Error('Lead not found');
    }

    let result;

    switch (action) {
      case 'find_lead':
        result = { 
          message: `Found lead: ${lead.full_name}`,
          lead: {
            id: lead.id,
            name: lead.full_name,
            company: lead.company,
            status: lead.status
          }
        };
        break;

      case 'update_status':
        if (!status) {
          throw new Error('Status is required for update_status action');
        }

        // Validate status
        const normalizedStatus = status.toLowerCase().trim();
        const validStatus = VALID_STATUSES.find(s => s.toLowerCase() === normalizedStatus) || 
                          VALID_STATUSES.find(s => normalizedStatus.includes(s.toLowerCase()));

        if (!validStatus) {
          throw new Error(`Invalid status. Valid statuses are: ${VALID_STATUSES.join(', ')}`);
        }

        const updateData: any = { status: validStatus };
        if (notes) {
          updateData.notes = notes;
        }

        const { error: updateError } = await supabaseClient
          .from('leads')
          .update(updateData)
          .eq('id', lead.id);

        if (updateError) throw updateError;
        result = { 
          message: `Status updated to ${validStatus}${notes ? ' with notes' : ''}`,
          lead: {
            id: lead.id,
            name: lead.full_name,
            status: validStatus
          }
        };
        break;

      case 'send_cold_email':
        const coldEmailResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-cold-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': req.headers.get('Authorization') || '',
            },
            body: JSON.stringify({ lead_id: lead.id, user_id }),
          }
        );
        result = await coldEmailResponse.json();
        break;

      case 'send_followup':
        const followupResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-followup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': req.headers.get('Authorization') || '',
            },
            body: JSON.stringify({ lead_id: lead.id, user_id }),
          }
        );
        result = await followupResponse.json();
        break;

      case 'schedule_call':
        result = { 
          message: 'Call scheduling coming soon',
          lead: {
            id: lead.id,
            name: lead.full_name
          }
        };
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
}); 