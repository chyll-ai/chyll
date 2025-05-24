// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
// @ts-ignore
import { google } from 'npm:googleapis@126.0.1';
// @ts-ignore
import { generateEmailContent, EmailContext } from '../_shared/openai.ts';

interface RequestEvent {
  method: string;
  headers: Headers;
  json: () => Promise<any>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

serve(async (req: RequestEvent) => {
  console.log('send-cold-email function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    const { lead_id, user_id } = await req.json();
    console.log('Received request with lead_id:', lead_id, 'user_id:', user_id);

    if (!lead_id || !user_id) {
      console.error('Missing required parameters:', { lead_id, user_id });
      return new Response(
        JSON.stringify({ error: 'lead_id and user_id are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    console.log('Initializing Supabase client');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get lead details
    console.log('Fetching lead details for lead_id:', lead_id);
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select(`
        id,
        full_name,
        email,
        company,
        job_title,
        client_id,
        status,
        industry,
        linkedin_url
      `)
      .eq('id', lead_id)
      .eq('client_id', user_id)
      .single();

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found or unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    console.log('Lead found:', { name: lead.full_name, email: lead.email });

    // Get user details
    console.log('Fetching user details for user_id:', user_id);
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select(`
        id,
        email,
        full_name,
        cold_email_template,
        gmail_refresh_token,
        company_name,
        job_title,
        industry,
        value_proposition,
        target_industries,
        expertise_areas,
        achievements,
        company_description,
        unique_selling_points,
        preferred_meeting_duration
      `)
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    console.log('User found:', { name: user.full_name, email: user.email });

    if (!user.gmail_refresh_token) {
      console.error('Gmail not connected for user:', user_id);
      return new Response(
        JSON.stringify({ error: 'Gmail not connected. Please connect your Gmail account first.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Gmail API client
    console.log('Initializing Gmail API client');
    const oauth2Client = new google.auth.OAuth2(
      Deno.env.get('GOOGLE_CLIENT_ID'),
      Deno.env.get('GOOGLE_CLIENT_SECRET'),
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback`
    );

    oauth2Client.setCredentials({
      refresh_token: user.gmail_refresh_token
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Generate email content using OpenAI
    console.log('Generating email content with OpenAI');
    const emailContext: EmailContext = {
      type: 'cold_email' as const,
      lead: {
        full_name: lead.full_name,
        job_title: lead.job_title,
        company: lead.company,
        industry: lead.industry,
        linkedin_url: lead.linkedin_url
      },
      user: {
        full_name: user.full_name,
        job_title: user.job_title,
        company_name: user.company_name,
        industry: user.industry,
        value_proposition: user.value_proposition,
        target_industries: user.target_industries,
        expertise_areas: user.expertise_areas,
        achievements: user.achievements,
        company_description: user.company_description,
        unique_selling_points: user.unique_selling_points,
        preferred_meeting_duration: user.preferred_meeting_duration
      }
    };
    console.log('Email context:', emailContext);

    const emailContent = await generateEmailContent(emailContext);
    console.log('Generated email content:', emailContent);

    // Create email
    const emailLines = [
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      `To: ${lead.email}`,
      `From: ${user.email}`,
      'Subject: Prise de contact professionnelle',
      '',
      emailContent
    ].join('\n');

    const encodedEmail = btoa(emailLines).replace(/\+/g, '-').replace(/\//g, '_');
    console.log('Email prepared for sending to:', lead.email);

    // Send email
    try {
      console.log('Sending email via Gmail API');
      const emailResponse = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail
        }
      });
      console.log('Gmail API response:', emailResponse);
    } catch (gmailError) {
      console.error('Error sending email via Gmail API:', gmailError);
      throw gmailError;
    }

    // Update lead status
    try {
      console.log('Updating lead status to "email envoyé"');
      const { error: updateError } = await supabaseClient
        .from('leads')
        .update({ 
          status: 'email envoyé',
          last_contacted_at: new Date().toISOString()
        })
        .eq('id', lead_id);

      if (updateError) {
        console.error('Error updating lead status:', updateError);
        throw updateError;
      }
      console.log('Lead status updated successfully');
    } catch (updateError) {
      console.error('Error updating lead:', updateError);
      throw updateError;
    }

    // Log the email in email_jobs table
    try {
      console.log('Inserting record into email_jobs table');
      const emailJob = {
        lead_id: lead.id,
        client_id: user_id,
        type: 'cold_email',
        status: 'sent',
        subject: 'Prise de contact professionnelle',
        body: emailContent,
        sent_at: new Date().toISOString()
      };
      console.log('Email job data:', emailJob);

      const { error: insertError } = await supabaseClient
        .from('email_jobs')
        .insert(emailJob);

      if (insertError) {
        console.error('Error inserting email job:', insertError);
        throw insertError;
      }
      console.log('Email job recorded successfully');
    } catch (insertError) {
      console.error('Error logging email job:', insertError);
      throw insertError;
    }

    console.log('Cold email process completed successfully');
    return new Response(
      JSON.stringify({
        message: `Cold email sent to ${lead.full_name}`,
        lead: {
          id: lead.id,
          name: lead.full_name,
          status: 'email envoyé'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-cold-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
}); 