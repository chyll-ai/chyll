// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
// @ts-ignore
import { google } from 'npm:googleapis@126.0.1';
// @ts-ignore
import { generateEmailContent } from '../_shared/openai.ts';

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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 // Explicitly set 200 status for OPTIONS
    });
  }

  try {
    const { lead_id, user_id } = await req.json();

    if (!lead_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'lead_id and user_id are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get lead details and their last email
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
        linkedin_url,
        email_jobs (
          sent_at,
          type,
          subject,
          thread_id
        )
      `)
      .eq('id', lead_id)
      .eq('client_id', user_id)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found or unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get user's email template and Gmail token
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select(`
        id,
        email,
        full_name,
        followup_template,
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
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (!user.gmail_refresh_token) {
      return new Response(
        JSON.stringify({ error: 'Gmail not connected. Please connect your Gmail account first.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Gmail API client
    const oauth2Client = new google.auth.OAuth2(
      Deno.env.get('GOOGLE_CLIENT_ID'),
      Deno.env.get('GOOGLE_CLIENT_SECRET'),
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback`
    );

    oauth2Client.setCredentials({
      refresh_token: user.gmail_refresh_token
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Get the last email sent to this lead
    const lastEmail = lead.email_jobs?.[0];
    const daysSinceLastEmail = lastEmail 
      ? Math.floor((Date.now() - new Date(lastEmail.sent_at).getTime()) / (1000 * 60 * 60 * 24))
      : undefined;

    // Generate email content using OpenAI
    const emailContent = await generateEmailContent({
      type: 'followup',
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
      },
      previousContact: {
        daysSince: daysSinceLastEmail,
        lastEmailSubject: lastEmail?.subject
      }
    });

    // Create email
    const emailLines = [
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      `To: ${lead.email}`,
      `From: ${user.email}`,
      `Subject: Re: ${lastEmail?.subject || 'Prise de contact professionnelle'}`,
      '',
      emailContent
    ].join('\n');

    const encodedEmail = btoa(emailLines).replace(/\+/g, '-').replace(/\//g, '_');

    // Send email
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
        threadId: lastEmail?.thread_id
      }
    });

    // Update lead status
    await supabaseClient
      .from('leads')
      .update({ 
        status: 'à relancer',
        last_contacted_at: new Date().toISOString()
      })
      .eq('id', lead_id);

    // Log the email in email_jobs table
    await supabaseClient
      .from('email_jobs')
      .insert({
        lead_id: lead.id,
        user_id: user_id,
        type: 'followup',
        status: 'sent',
        subject: `Re: ${lastEmail?.subject || 'Prise de contact professionnelle'}`,
        body: emailContent,
        thread_id: lastEmail?.thread_id
      });

    return new Response(
      JSON.stringify({
        message: `Follow-up email sent to ${lead.full_name}`,
        lead: {
          id: lead.id,
          name: lead.full_name,
          status: 'à relancer'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error sending follow-up email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
