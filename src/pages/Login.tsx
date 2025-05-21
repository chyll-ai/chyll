
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the page is loaded with a hash (for authentication)
    if (location.hash && location.hash.includes('access_token')) {
      console.log("Hash detected in the URL of login, processing auth");
      processAuth();
      return;
    }

    // Check if the user is already connected
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // User is logged in, redirect to dashboard or onboarding based on profile
          checkProfileAndRedirect(data.session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, [location, navigate]);

  const processAuth = async () => {
    try {
      // Extract token from hash
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');

      if (accessToken) {
        console.log("Setting session with access token");
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') || '',
        });

        if (error) {
          console.error("Error setting session:", error);
          toast.error("Authentication error. Please try again.");
          return;
        }

        // Clean URL hash
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Get user id and check profile
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          checkProfileAndRedirect(data.user.id);
        }
      }
    } catch (error) {
      console.error("Error processing authentication:", error);
      toast.error("Authentication error. Please try again.");
    }
  };

  const checkProfileAndRedirect = async (userId: string) => {
    try {
      // Create client record if it doesn't exist
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (clientError) {
        console.error("Error checking client:", clientError);
        throw new Error("Error checking client");
      }

      if (!client) {
        console.log("Client not found, creating...");
        const { data: userData } = await supabase.auth.getUser();
        const email = userData?.user?.email || '';
        
        await supabase
          .from('clients')
          .insert({
            id: userId,
            email: email
          });
        console.log("Client created successfully");
      }

      // Check if the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Error fetching your profile");
        return;
      }

      // Redirect based on whether the user has a profile
      if (!profile) {
        console.log("No profile found, redirecting to onboarding");
        navigate('/onboarding', { replace: true });
      } else {
        console.log("Profile found, redirecting to assistant");
        navigate('/assistant', { replace: true });
      }
    } catch (error: any) {
      console.error("Error in checkProfileAndRedirect:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }
    
    try {
      setLoading(true);
      
      // Use explicit URL for redirection
      const redirectUrl = window.location.origin + "/login";
      console.log("Redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Un lien de connexion vous a été envoyé par email");
      setMessageSent(true);
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // More specific error messages
      if (error.message?.includes("path is invalid")) {
        toast.error("Redirection configuration error. Please check the redirect URLs in Supabase.");
      } else {
        toast.error(error.error_description || error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saisissez votre email pour recevoir un lien de connexion magique
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email-input" className="block text-sm font-medium text-foreground">
              Adresse Email
            </label>
            <Input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full"
            />
          </div>

          <Button
            id="login-button"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Se connecter'}
          </Button>
          
          {messageSent && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Lien de connexion envoyé ! Veuillez vérifier votre boîte mail.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
