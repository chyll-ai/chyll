import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Log environment variables (without exposing secrets)
console.log('Environment check:', {
  hasGoogleClientId: !!GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!GOOGLE_CLIENT_SECRET,
  hasSupabaseUrl: !!SUPABASE_URL,
  hasSupabaseServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request data first to check action type
    let reqData;
    try {
      reqData = await req.json();
      console.log('Request data:', {
        action: reqData.action,
        hasCode: !!reqData.code,
        hasRedirectUrl: !!reqData.redirect_url
      });
    } catch (e) {
      console.error("Error parsing request JSON:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, code, state, redirect_url } = reqData;
    
    if (!action) {
      console.error('Missing action parameter');
      throw new Error('Missing required parameter: action');
    }

    // Check if Google credentials are configured
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth credentials');
      return new Response(
        JSON.stringify({ error: 'Google OAuth credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle unified authentication actions (require apikey but not user auth)
    if (action === 'unified_connect' || action === 'unified_auth') {
      // Check for authorization header with anon key for basic request validation
      const authHeader = req.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Missing authorization header for unified action');
        return new Response(
          JSON.stringify({ error: 'Missing authorization header' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // For unified actions, we don't need to validate the user session, just the anon key
      console.log('Processing unified action with anon key authentication');

      if (action === 'unified_connect') {
        console.log("Initiating unified Google OAuth flow (auth + Gmail)");

        // Generate a unique state token for the OAuth2 flow
        const stateToken = crypto.randomUUID();
        
        // Use the provided redirect URL or determine based on environment
        const isDevelopment = redirect_url?.includes('localhost');
        const finalRedirectUrl = redirect_url || (isDevelopment 
          ? "http://localhost:8080/login"
          : "https://chyll.ai/login");

        console.log("Unified OAuth Configuration:", {
          clientId: GOOGLE_CLIENT_ID,
          redirectUrl: finalRedirectUrl,
          state: stateToken,
          isDevelopment
        });
        
        // Create an OAuth URL with both auth and Gmail scopes
        const oauthUrl = `https://accounts.google.com/o/oauth2/auth?` +
          `client_id=${GOOGLE_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent(finalRedirectUrl)}` +
          `&response_type=code` +
          `&scope=${encodeURIComponent([
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send'
          ].join(' '))}` +
          `&state=${stateToken}` +
          `&access_type=offline` +
          `&prompt=consent`;
        
        console.log("Generated unified OAuth URL");
        
        return new Response(
          JSON.stringify({
            status: "success",
            message: "Unified OAuth flow initiated",
            oauth_url: oauthUrl
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (action === 'unified_auth') {
        if (!code || !state) {
          console.error('Missing required parameters for unified auth');
          throw new Error('Missing required parameters: code and state');
        }
        
        console.log("Processing unified authentication (auth + Gmail tokens)");
        
        // Use the provided redirect URL or determine based on environment
        const isDevelopment = redirect_url?.includes('localhost');
        const finalRedirectUrl = redirect_url || (isDevelopment 
          ? "http://localhost:8080/login"
          : "https://chyll.ai/login");
        
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
        console.log("Received unified tokens:", { 
          hasAccessToken: !!tokenData.access_token,
          hasRefreshToken: !!tokenData.refresh_token,
          hasIdToken: !!tokenData.id_token,
          scope: tokenData.scope
        });

        // Get user info from the ID token to prepare for Gmail token storage
        let userInfo = null;
        if (tokenData.id_token) {
          try {
            // Decode the ID token to get user info (for Gmail token storage later)
            const tokenParts = tokenData.id_token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            userInfo = {
              id: payload.sub,
              email: payload.email,
              name: payload.name
            };
            console.log('Extracted user info from ID token:', { id: userInfo.id, email: userInfo.email });
          } catch (error) {
            console.error('Error decoding ID token:', error);
          }
        }

        // Return the tokens for Supabase authentication and indicate Gmail connection status
        return new Response(
          JSON.stringify({
            status: "success",
            message: "Unified authentication successful",
            id_token: tokenData.id_token,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
            scope: tokenData.scope,
            gmail_connected: false, // Will be true after Supabase auth creates the user
            user_info: userInfo
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // For other actions, verify authorization is required
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Get the user from the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated request for user:', user.id);

    // Handle authenticated actions
    if (action === 'connect') {
      console.log("Initiating Google OAuth flow");

      // Generate a unique state token for the OAuth2 flow
      const stateToken = crypto.randomUUID();
      
      // Use the provided redirect URL or determine based on environment
      const isDevelopment = redirect_url?.includes('localhost');
      const finalRedirectUrl = redirect_url || (isDevelopment 
        ? "http://localhost:8080/assistant"
        : "https://chyll.ai/assistant");

      console.log("OAuth Configuration:", {
        clientId: GOOGLE_CLIENT_ID,
        redirectUrl: finalRedirectUrl,
        state: stateToken,
        isDevelopment
      });
      
      // Create an OAuth URL with the GOOGLE_CLIENT_ID
      const oauthUrl = `https://accounts.google.com/o/oauth2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(finalRedirectUrl)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent([
          'openid',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.send'
        ].join(' '))}` +
        `&state=${stateToken}` +
        `&access_type=offline` +
        `&prompt=consent`;
      
      console.log("Generated OAuth URL");
      
      return new Response(
        JSON.stringify({
          status: "success",
          message: "OAuth flow initiated",
          oauth_url: oauthUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'exchange_code') {
      if (!code) {
        console.error('Missing required parameter: code');
        throw new Error('Missing required parameter: code');
      }
      
      console.log("Starting token exchange process");
      
      // Use the provided redirect URL or determine based on environment
      const isDevelopment = redirect_url?.includes('localhost');
      const finalRedirectUrl = redirect_url || (isDevelopment 
        ? "http://localhost:8080/assistant"
        : "https://chyll.ai/assistant");
      
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
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        hasIdToken: !!tokenData.id_token,
        scope: tokenData.scope
      });

      // Store the Gmail tokens
      const { error: tokenError } = await supabase
        .from('tokens')
        .upsert({
          client_id: user.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          scope: tokenData.scope?.split(' ') || []
        }, {
          onConflict: 'client_id'
        });

      if (tokenError) {
        console.error("Error storing tokens:", tokenError);
        throw new Error('Failed to store tokens');
      }

      return new Response(
        JSON.stringify({
          status: "success",
          message: "Authentication successful"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'store_gmail_tokens') {
      // This action stores Gmail tokens after Supabase authentication
      const { access_token, refresh_token, expires_in, scope } = reqData;
      
      if (!access_token || !refresh_token) {
        throw new Error('Missing required Gmail tokens');
      }

      console.log("Storing Gmail tokens for authenticated user:", user.id);

      // First, ensure the client record exists (using service role to bypass RLS)
      try {
        const { data: existingClient, error: checkError } = await supabase
          .from('clients')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking client:", checkError);
        }

        if (!existingClient) {
          console.log("Creating client record for user:", user.id);
          const { error: createClientError } = await supabase
            .from('clients')
            .insert({
              id: user.id,
              email: user.email || ''
            });

          if (createClientError) {
            console.error("Error creating client record:", createClientError);
            // Don't fail the entire flow if client creation fails
          } else {
            console.log("Client record created successfully");
          }
        }
      } catch (clientError) {
        console.error("Error in client record handling:", clientError);
        // Don't fail the entire flow
      }

      // Store the Gmail tokens
      const { error: tokenError } = await supabase
        .from('tokens')
        .upsert({
          client_id: user.id,
          access_token: access_token,
          refresh_token: refresh_token,
          expires_at: new Date(Date.now() + (expires_in || 3600) * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          scope: scope?.split(' ') || []
        }, {
          onConflict: 'client_id'
        });

      if (tokenError) {
        console.error("Error storing Gmail tokens:", tokenError);
        throw new Error('Failed to store Gmail tokens');
      }

      console.log("Gmail tokens stored successfully for user:", user.id);

      return new Response(
        JSON.stringify({
          status: "success",
          message: "Gmail tokens stored successfully",
          gmail_connected: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error(`Unsupported action: ${action}`);
  } catch (error) {
    console.error('Error in connect-gmail function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
