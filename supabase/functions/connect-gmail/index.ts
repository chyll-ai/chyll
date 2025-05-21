import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || 'YOUR_CLIENT_ID';
const REDIRECT_URL = "https://chyll.ai/assistant";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Check for proper authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reqData = await req.json();
    const { action, thread_id, run_id, user_token, tool_call_id, email_data } = reqData;
    
    if (!action) {
      throw new Error('Missing required parameter: action');
    }

    // Handle different actions
    if (action === 'connect') {
      // Existing connect functionality
      if (!thread_id || !run_id || !user_token) {
        throw new Error('Missing required parameters for connect: thread_id, run_id, or user_token');
      }

      console.log("Processing Gmail connection request for thread:", thread_id, "and run:", run_id);

      // Generate a unique state token for the OAuth2 flow
      const stateToken = crypto.randomUUID();
      
      // Create an OAuth URL with the GOOGLE_CLIENT_ID
      const oauthUrl = `https://accounts.google.com/o/oauth2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send')}` +
        `&state=${stateToken}` +
        `&access_type=offline` +
        `&prompt=consent`;
      
      // Make sure to include the OAuth URL in the response
      console.log("Generated OAuth URL:", oauthUrl);
      
      // Submit the tool outputs back to OpenAI with the OAuth URL
      if (OPENAI_API_KEY) {
        const toolOutputResponse = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
          body: JSON.stringify({
            tool_outputs: [{
              tool_call_id: tool_call_id || crypto.randomUUID(),
              output: JSON.stringify({
                status: "success",
                message: "OAuth URL generated",
                url: oauthUrl
              })
            }]
          })
        });

        console.log("Tool output response status:", toolOutputResponse.status);
        
        if (!toolOutputResponse.ok) {
          const errorData = await toolOutputResponse.json();
          console.error("Error submitting tool outputs:", errorData);
        }
      } else {
        console.warn("OPENAI_API_KEY not set, skipping submit_tool_outputs");
      }
      
      return new Response(
        JSON.stringify({
          status: "success",
          message: "Gmail connection initiated",
          oauth_url: oauthUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'send_email') {
      // New email sending functionality
      if (!thread_id || !run_id || !email_data) {
        throw new Error('Missing required parameters for send_email: thread_id, run_id, or email_data');
      }

      const { access_token, to, subject, body } = email_data;
      
      if (!access_token || !to || !subject || !body) {
        throw new Error('Missing required email parameters: access_token, to, subject, or body');
      }
      
      console.log(`Processing send email request to ${to}`);
      
      // Base64 encode the email content
      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/html; charset=utf-8`,
        '',
        body
      ].join('\r\n');
      
      const encodedEmail = btoa(emailContent).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
      // Make request to Gmail API to send email
      const sendEmailResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail
        })
      });
      
      if (!sendEmailResponse.ok) {
        const errorData = await sendEmailResponse.json();
        console.error("Error sending email:", errorData);
        throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
      }
      
      const emailResult = await sendEmailResponse.json();
      console.log("Email sent successfully:", emailResult);
      
      // Submit the tool outputs back to OpenAI with the email result
      if (OPENAI_API_KEY) {
        const toolOutputResponse = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
          body: JSON.stringify({
            tool_outputs: [{
              tool_call_id: tool_call_id || crypto.randomUUID(),
              output: JSON.stringify({
                status: "success",
                message: "Email sent successfully",
                email_id: emailResult.id
              })
            }]
          })
        });

        console.log("Tool output response status:", toolOutputResponse.status);
        
        if (!toolOutputResponse.ok) {
          const errorData = await toolOutputResponse.json();
          console.error("Error submitting tool outputs:", errorData);
        }
      }
      
      return new Response(
        JSON.stringify({
          status: "success",
          message: "Email sent successfully",
          email_id: emailResult.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error(`Unsupported action: ${action}`);
    }
    
  } catch (error) {
    console.error('Error in connect-gmail function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
