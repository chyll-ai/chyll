import React, { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { debugStorage } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // If we have a user and auth is done loading, redirect to assistant
    if (!authLoading && user?.id) {
      console.log('Login: User already authenticated, redirecting to assistant...');
      navigate('/assistant', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('Login: Starting Google OAuth sign in...');
      debugStorage();
      
      // Get the current URL without any hash or query parameters
      const currentOrigin = window.location.origin;
      const redirectTo = `${currentOrigin}/login`;
      
      console.log('Login: OAuth redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
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
