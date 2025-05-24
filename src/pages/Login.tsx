
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
        console.log('Login: Checking auth state...');
        debugStorage();
        
        // Check if user is already logged in
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Login: Current session state:', {
          exists: !!session,
          userId: session?.user?.id,
          expiresAt: session?.expires_at
        });
        
        if (sessionError) {
          console.error('Login: Session error:', sessionError);
          return;
        }

        if (session?.user) {
          console.log('Login: Found active session, redirecting to assistant...');
          // Direct redirect to assistant - let the assistant page handle profile checks
          navigate('/assistant', { replace: true });
        } else {
          console.log('Login: No active session found');
        }
      } catch (error) {
        console.error("Login: Error in auth change handler:", error);
        toast.error("Authentication error. Please try again.");
      }
    };

    handleAuthChange();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Login: Auth state changed:', { event, userId: session?.user?.id });
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('Login: User signed in, redirecting to assistant...');
        // Direct redirect to assistant - let the assistant page handle profile checks
        navigate('/assistant', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('Login: Starting Google OAuth sign in...');
      debugStorage();
      
      // Get the current URL without any hash or query parameters
      const currentOrigin = window.location.origin;
      const redirectTo = `${currentOrigin}/assistant`;
      
      console.log('Login: OAuth redirect URL:', redirectTo);
      
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
        console.error('Login: Google OAuth error:', error);
        throw error;
      }

      console.log('Login: Google OAuth initiated successfully:', data);
      
      // The redirect will happen automatically, no need to do anything else here
    } catch (error: any) {
      console.error("Login: Google authentication error:", error);
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
