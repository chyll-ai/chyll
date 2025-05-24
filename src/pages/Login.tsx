import React, { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        // Check for OAuth response in URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (code) {
          // If we have a code, we're in the OAuth callback
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (session?.user) {
            await checkProfileAndRedirect(session.user.id);
          }
          return;
        }

        // Check if user is already logged in
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          await checkProfileAndRedirect(session.user.id);
        }
      } catch (error) {
        console.error("Error in auth change handler:", error);
        toast.error("Authentication error. Please try again.");
      }
    };

    handleAuthChange();
  }, [location, navigate]);

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

      // Check if the user has a profile and if it's complete
      const { data: profile, error: profileError } = await supabase
        .from('client_profile')
        .select('*, is_complete')
        .eq('client_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Error fetching your profile");
        return;
      }

      // Redirect based on whether the user has a complete profile
      if (profile && profile.is_complete === true) {
        console.log("Complete profile found, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      } else {
        console.log("No complete profile found, redirecting to assistant");
        navigate('/assistant', { replace: true });
      }
    } catch (error: any) {
      console.error("Error in checkProfileAndRedirect:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          skipBrowserRedirect: false
        }
      });

      if (error) {
        throw error;
      }

      // The page will redirect to Google at this point
    } catch (error: any) {
      console.error("Google authentication error:", error);
      toast.error(error.message || "Failed to connect with Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous avec votre compte Google
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Mail className="h-5 w-5" />
            Se connecter avec Gmail
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
