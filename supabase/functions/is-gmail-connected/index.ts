
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extraire le token d'authentification de l'en-tête
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

    // Extraire le token Bearer
    const token = authHeader.replace('Bearer ', '');
    
    // Initialiser le client Supabase avec la clé de service
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Authentifier l'utilisateur avec le token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Erreur d'authentification:", authError);
      return new Response(
        JSON.stringify({ 
          connected: false, 
          reason: 'invalid_auth_token' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rechercher le token Gmail dans la table tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('access_token, expires_at')
      .eq('client_id', user.id)
      .single();
    
    if (tokenError || !tokenData) {
      console.log("Aucun token Gmail trouvé pour l'utilisateur:", user.id);
      return new Response(
        JSON.stringify({ 
          connected: false, 
          reason: 'no_gmail_token' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que le token existe et n'est pas expiré
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
    
    // Retourner le statut de connexion
    return new Response(
      JSON.stringify({ 
        connected: !isExpired, 
        expired: isExpired 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erreur lors de la vérification de la connexion Gmail:", error);
    
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
