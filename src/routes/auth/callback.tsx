import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Log all URL and auth parameters for debugging
        const params = Object.fromEntries(searchParams.entries());
        const hash = window.location.hash;
        
        console.log('Auth callback debug:', {
          params,
          url: window.location.href,
          hash,
          isAuthenticated,
          hasHash: !!hash,
          hasCode: !!params.code,
          hasError: !!params.error,
          pathname: window.location.pathname,
          origin: window.location.origin
        });

        // Check for error in the URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          toast.error(errorDescription || error || 'Authentication failed');
          navigate('/login', { replace: true });
          return;
        }

        // If we have a hash, let Supabase process it
        if (hash) {
          const { data: hashData, error: hashError } = await supabase.auth.getSession();
          if (hashError) {
            console.error('Error processing hash:', hashError);
            toast.error('Failed to process authentication response');
            navigate('/login', { replace: true });
            return;
          }
          
          // Log the hash processing result
          console.log('Hash processing result:', {
            hasSession: !!hashData.session,
            userId: hashData.session?.user?.id,
            accessToken: hashData.session?.access_token ? 'present' : 'missing'
          });
        }

        // Add a delay to ensure session is properly initialized
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Final session check
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error('Failed to initialize session');
          navigate('/login', { replace: true });
          return;
        }

        if (!session) {
          console.error('No session found after callback');
          toast.error('Authentication failed - no session found');
          navigate('/login', { replace: true });
          return;
        }

        // Success! Redirect to dashboard
        console.log('Authentication successful:', {
          userId: session.user.id,
          email: session.user.email
        });
        
        toast.success('Successfully signed in!');
        navigate('/dashboard', { replace: true });

      } catch (error) {
        console.error('Callback error:', error);
        toast.error('An unexpected error occurred');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, searchParams, isAuthenticated]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
} 