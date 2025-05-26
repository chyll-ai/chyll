import React, { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // If we have a session and auth is done loading, redirect to the intended destination
    if (!authLoading && session?.user) {
      console.log('Login: User already authenticated, redirecting...');
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [session, authLoading, navigate, location.state]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('Login: Starting Google OAuth sign in...');
      
      // Get the base URL for the current environment
      const baseUrl = window.location.origin;
      const redirectTo = `${baseUrl}/auth/callback`;
      
      console.log('Login: OAuth configuration:', {
        baseUrl,
        redirectTo,
        currentUrl: window.location.href,
        hostname: window.location.hostname,
        port: window.location.port,
        environment: import.meta.env.MODE
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Login: Google OAuth error:', error);
        throw error;
      }

      if (!data?.url) {
        console.error('Login: No OAuth URL returned');
        toast.error('Failed to initialize authentication');
        return;
      }

      // Proceed with redirect
      console.log('Login: Redirecting to OAuth URL:', data.url);
      window.location.href = data.url;
      
    } catch (error: any) {
      console.error("Login: Google authentication error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If we're already authenticated, show a message
  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Already signed in. Redirecting...</p>
        </div>
      </div>
    );
  }

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
