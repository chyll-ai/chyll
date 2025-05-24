import { createClient } from '@supabase/supabase-js';
import { createHandler } from '../shared/middleware';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface FollowupRequest {
  user_id: string;
  lead_id: string;
}

const handler = async (req: Request) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { user_id, lead_id }: FollowupRequest = await req.json();
  
  // Get user profile and lead data
  const [profileResult, leadResult] = await Promise.all([
    supabase
      .from('client_profile')
      .select('*')
      .eq('client_id', user_id)
      .maybeSingle(),
    supabase
      .from('leads')
      .select('email, first_name')
      .eq('id', lead_id)
      .maybeSingle()
  ]);

  if (profileResult.error) {
    throw new Error('Failed to fetch user profile');
  }

  if (leadResult.error) {
    throw new Error('Failed to fetch lead data');
  }

  const profile = profileResult.data;
  const lead = leadResult.data;

  if (!profile || !lead) {
    throw new Error('Profile or lead not found');
  }

  // Generate and send the follow-up email
  const emailSubject = `Quick follow-up from ${profile.company_name}`;
  const emailBody = `Hi ${lead.first_name},\n\nI hope this finds you well...`; // Customize email template

  const { error: emailError } = await supabase.functions.invoke('send-email', {
    body: {
      user_id,
      lead_id,
      subject: emailSubject,
      body: emailBody
    }
  });

  if (emailError) {
    throw new Error('Failed to send follow-up email');
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

export default createHandler(handler);
