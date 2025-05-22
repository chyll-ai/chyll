
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    // Extract authentication token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ 
          connected: false, 
          reason: 'missing_auth_token' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the Bearer token
    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase client with service role key
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Authenticate the user with the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ 
          connected: false, 
          reason: 'invalid_auth_token' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Search for the Gmail token in the tokens table
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('access_token, expires_at')
      .eq('client_id', user.id)
      .single();
    
    if (tokenError || !tokenData) {
      console.log("No Gmail token found for user:", user.id);
      return new Response(
        JSON.stringify({ 
          connected: false, 
          reason: 'token_not_found' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if the token exists and is not expired
    const accessToken = tokenData.access_token;
    const expiresAt = tokenData.expires_at;
    
    if (!accessToken) {
      return new Response(
        JSON.stringify({ 
          connected: false, 
          reason: 'missing_access_token' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const expiry = new Date(expiresAt);
    const isExpired = expiry <= now;
    
    // Return the connection status
    return new Response(
      JSON.stringify({ 
        connected: !isExpired, 
        expired: isExpired 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error checking Gmail connection:", error);
    
    return new Response(
      JSON.stringify({ 
        connected: false, 
        reason: 'internal_error',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
