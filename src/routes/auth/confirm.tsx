import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { EmailOtpType } from '@supabase/supabase-js';

export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get all possible auth parameters
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type') as EmailOtpType;
        const code = searchParams.get('code');
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');
        
        console.log('Auth confirm:', {
          hasTokenHash: !!token_hash,
          type,
          hasCode: !!code,
          provider,
          error,
          error_description,
          currentUrl: window.location.href,
          searchParams: Object.fromEntries(searchParams.entries())
        });

        // Handle OAuth errors
        if (error || error_description) {
          console.error('OAuth error:', { error, error_description });
          toast.error(error_description || error || 'Authentication failed');
          navigate('/login', { replace: true });
          return;
        }

        // Handle OAuth callback
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            toast.error(error.message || 'Authentication failed');
            navigate('/login', { replace: true });
            return;
          }

          if (data.session) {
            console.log('OAuth authentication successful:', {
              userId: data.session.user.id,
              email: data.session.user.email
            });
            toast.success('Successfully signed in!');
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        // Handle email verification
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
          });

          if (error) {
            console.error('Error verifying token:', error);
            toast.error(error.message || 'Authentication failed');
            navigate('/login', { replace: true });
            return;
          }

          // Get the session to confirm we're authenticated
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.error('No session after verification');
            toast.error('Authentication failed');
            navigate('/login', { replace: true });
            return;
          }

          console.log('Email verification successful:', {
            userId: session.user.id,
            email: session.user.email
          });

          toast.success('Email verified successfully!');
          navigate('/dashboard', { replace: true });
          return;
        }

        // If we get here, we don't have valid auth parameters
        console.error('Invalid auth parameters');
        toast.error('Invalid authentication parameters');
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Error in auth confirmation:', error);
        toast.error('Authentication failed');
        navigate('/login', { replace: true });
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  // Show loading state while processing
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-sm text-muted-foreground">Verifying authentication...</p>
      </div>
    </div>
  );
} 