
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || 'YOUR_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || 'YOUR_CLIENT_SECRET';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

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

    // Parse request data
    let reqData;
    try {
      reqData = await req.json();
    } catch (e) {
      console.error("Error parsing request JSON:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, thread_id, run_id, user_token, tool_call_id, email_data, code, client_id, redirect_url } = reqData;
    
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

      // Check if we already have tokens for this user
      if (client_id) {
        const { data: existingTokens, error: tokenError } = await supabase
          .from('tokens')
          .select('*')
          .eq('client_id', client_id)
          .single();
          
        if (!tokenError && existingTokens && existingTokens.access_token) {
          console.log("Found existing Gmail token, checking if valid...");
          
          // Check if token is valid by testing a simple request
          try {
            const testResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
              headers: {
                'Authorization': `Bearer ${existingTokens.access_token}`
              }
            });
            
            if (testResponse.ok) {
              console.log("Existing token is valid, using it");
              
              // Submit the tool outputs back to OpenAI with the success message
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
                        message: "Already connected to Gmail",
                        access_token: existingTokens.access_token
                      })
                    }]
                  })
                });

                console.log("Tool output response status:", toolOutputResponse.status);
              }
              
              return new Response(
                JSON.stringify({
                  status: "success",
                  message: "Already connected to Gmail",
                  access_token: existingTokens.access_token
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            } else {
              console.log("Existing token is invalid, will generate new one");
            }
          } catch (error) {
            console.log("Error checking existing token:", error);
            // Continue with generating a new token
          }
        }
      }

      // Generate a unique state token for the OAuth2 flow
      const stateToken = crypto.randomUUID();
      
      // Get the redirect URL from the frontend or use a default
      const finalRedirectUrl = redirect_url || "https://chyll.ai/assistant";
      
      // Create an OAuth URL with the GOOGLE_CLIENT_ID
      const oauthUrl = `https://accounts.google.com/o/oauth2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(finalRedirectUrl)}` +
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
      // Email sending functionality
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
    } else if (action === 'exchange_code') {
      // New action to exchange authorization code for tokens
      if (!code || !client_id) {
        throw new Error('Missing required parameters for exchange_code: code or client_id');
      }
      
      console.log("Exchanging authorization code for tokens");
      
      // Get the redirect URL from the frontend or use a default
      const finalRedirectUrl = redirect_url || "https://chyll.ai/assistant";
      console.log("Using redirect URL:", finalRedirectUrl);
      
      // Check for existing tokens for this user - avoid duplicate creation
      const { data: existingTokensData, error: existingTokensError } = await supabase
        .from('tokens')
        .select('*')
        .eq('client_id', client_id)
        .single();

      // If a token already exists, we should update it rather than creating a new one
      const tokenExists = !existingTokensError && existingTokensData;
      
      // Exchange the authorization code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: finalRedirectUrl,
          grant_type: 'authorization_code'
        }).toString()
      });
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error("Error exchanging code for tokens:", errorData);
        throw new Error(`Failed to exchange code: ${JSON.stringify(errorData)}`);
      }
      
      const tokenData = await tokenResponse.json();
      console.log("Received tokens:", { 
        access_token_length: tokenData.access_token?.length,
        refresh_token_length: tokenData.refresh_token?.length,
      });
      
      // Store the tokens in the database - update if they already exist, insert if not
      if (tokenExists) {
        console.log("Updating existing token record");
        const { error: updateError } = await supabase
          .from('tokens')
          .update({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token || existingTokensData.refresh_token, // Keep existing refresh token if not provided
            expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          })
          .eq('client_id', client_id);
        
        if (updateError) {
          console.error("Error updating tokens:", updateError);
          throw new Error(`Failed to update tokens: ${updateError.message}`);
        }
      } else {
        console.log("Creating new token record");
        const { error: insertError } = await supabase
          .from('tokens')
          .insert({
            client_id,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          });
        
        if (insertError) {
          console.error("Error storing tokens:", insertError);
          throw new Error(`Failed to store tokens: ${insertError.message}`);
        }
      }
      
      console.log("Tokens stored successfully");
      
      return new Response(
        JSON.stringify({
          status: "success",
          message: "Gmail connected successfully",
          access_token: tokenData.access_token
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
