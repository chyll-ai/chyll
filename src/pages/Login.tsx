
import React, { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { debugStorage } from '@/lib/supabase';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        console.log('Checking auth state on Login page...');
        debugStorage();
        
        // Check if user is already logged in
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Current session state:', {
          exists: !!session,
          userId: session?.user?.id,
          expiresAt: session?.expires_at
        });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          console.log('Found active session, checking profile...');
          await checkProfileAndRedirect(session.user.id);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error("Error in auth change handler:", error);
        toast.error("Authentication error. Please try again.");
      }
    };

    handleAuthChange();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, userId: session?.user?.id });
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, checking profile...');
        await checkProfileAndRedirect(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location, navigate]);

  const checkProfileAndRedirect = async (userId: string) => {
    try {
      console.log('Starting checkProfileAndRedirect for user:', userId);
      
      // Check if client record exists (it should have been created by the Edge Function)
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (clientError) {
        console.error("Error checking client:", clientError);
        console.log("Client record may not exist yet, proceeding anyway");
      }

      console.log('Client check result:', { exists: !!client, client });

      // Check if the user has a profile and if it's complete
      console.log('Checking for user profile...');
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

      console.log('Profile check result:', { exists: !!profile, isComplete: profile?.is_complete });

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

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google OAuth sign in...');
      debugStorage();
      
      // Get the current URL without any hash or query parameters
      const currentOrigin = window.location.origin;
      const redirectTo = `${currentOrigin}/assistant`;
      
      console.log('OAuth redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      console.log('Google OAuth initiated successfully:', data);
      
      // The redirect will happen automatically, no need to do anything else here
    } catch (error: any) {
      console.error("Google authentication error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to Chyll</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with Google to get started
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Mail className="h-5 w-5" />
            Sign in with Google
          </Button>
          
          <p className="mt-4 text-xs text-center text-muted-foreground">
            You'll set up Gmail permissions later when you're ready to send emails.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
