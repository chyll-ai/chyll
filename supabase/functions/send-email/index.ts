
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  user_id: string;
  lead_id: string;
  subject: string;
  body: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestData: EmailRequest = await req.json();
    const { user_id, lead_id, subject, body } = requestData;
    
    console.log(`Processing email request for user: ${user_id}, lead: ${lead_id}`);
    
    // Validation
    if (!user_id || !lead_id || !subject || !body) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // 1. Get Gmail access token for the user
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("access_token")
      .eq("client_id", user_id)
      .maybeSingle();
      
    if (tokenError || !tokenData?.access_token) {
      console.error("Error fetching Gmail token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Gmail token not found or invalid" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const accessToken = tokenData.access_token;
    
    // 2. Get lead email from leads table
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select("email")
      .eq("id", lead_id)
      .maybeSingle();
      
    if (leadError || !leadData?.email) {
      console.error("Error fetching lead email:", leadError);
      return new Response(
        JSON.stringify({ error: "Lead email not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const recipientEmail = leadData.email;
    
    // 3. Compose and send email via Gmail API
    console.log(`Sending email to: ${recipientEmail}`);
    
    // Format the email in the required MIME format
    const emailContent = [
      `To: ${recipientEmail}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      body
    ].join("\r\n");
    
    // Convert the email content to base64url format as required by Gmail API
    const encodedEmail = btoa(emailContent)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    
    // Send the email using Gmail API
    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    });
    
    if (!gmailResponse.ok) {
      const errorData = await gmailResponse.json();
      console.error("Gmail API error:", JSON.stringify(errorData));
      
      // Record the failed email job
      await supabase
        .from("email_jobs")
        .insert({
          client_id: user_id,
          lead_id: lead_id,
          subject: subject,
          body: body,
          status: "failed",
          error: JSON.stringify(errorData)
        });
        
      return new Response(
        JSON.stringify({ error: "Failed to send email via Gmail", details: errorData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const gmailData = await gmailResponse.json();
    console.log("Email sent successfully:", JSON.stringify(gmailData));
    
    // 4. Record successful email in email_jobs table
    const { error: insertError } = await supabase
      .from("email_jobs")
      .insert({
        client_id: user_id,
        lead_id: lead_id,
        subject: subject,
        body: body,
        status: "sent",
        sent_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error("Error recording email job:", insertError);
      // We still return success since the email was sent
    }
    
    return new Response(
      JSON.stringify({ success: true, message_id: gmailData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
