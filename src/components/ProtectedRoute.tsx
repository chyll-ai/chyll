import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompleteProfile?: boolean;
}

const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex h-screen flex-col items-center justify-center gap-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireCompleteProfile = false 
}) => {
  const { isAuthenticated, isLoading: authLoading, session } = useAuth();
  const { profile, isComplete, isLoading: profileLoading, error: profileError } = useProfile();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to initialize
      if (authLoading) {
        setLoadingMessage('Checking authentication...');
        return;
      }

      console.log('ProtectedRoute: Checking auth state:', {
        isAuthenticated,
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        authLoading,
        requireCompleteProfile,
        hasProfile: !!profile,
        isComplete,
        profileLoading,
        profileError
      });

      // Verify we have a valid session with access token
      if (!isAuthenticated || !session?.access_token) {
        console.log('ProtectedRoute: Not authenticated or missing access token, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }

      // Only wait for profile loading if we require a complete profile
      if (requireCompleteProfile && profileLoading) {
        setLoadingMessage('Loading profile...');
        return;
      }

      // Handle profile errors only if we require a complete profile
      if (requireCompleteProfile && profileError) {
        console.error('ProtectedRoute: Profile error:', profileError);
        setLoadingMessage('Error loading profile. Retrying...');
        return;
      }

      // If profile completion is required, check both existence and completion
      if (requireCompleteProfile) {
        if (!profile) {
          console.log('ProtectedRoute: Profile required but does not exist, redirecting to assistant');
          navigate('/assistant', { replace: true });
          return;
        }
        
        if (!isComplete) {
          console.log('ProtectedRoute: Profile exists but incomplete, redirecting to assistant');
          navigate('/assistant', { replace: true });
          return;
        }
      }

      // Verify session is still valid
      try {
        setLoadingMessage('Verifying session...');
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession?.access_token) {
          console.error('ProtectedRoute: Session validation failed:', {
            error: sessionError,
            hasAccessToken: !!currentSession?.access_token
          });
          navigate('/login', { replace: true });
          return;
        }

        // All checks passed
        setIsInitialized(true);
        setLoadingMessage('Loading...');
      } catch (error: any) {
        console.error('ProtectedRoute: Error validating session:', {
          error,
          message: error.message
        });
        navigate('/login', { replace: true });
        return;
      }
    };

    checkAuth();
  }, [
    isAuthenticated,
    authLoading,
    navigate,
    requireCompleteProfile,
    profile,
    isComplete,
    profileLoading,
    session,
    profileError
  ]);

  // Only show loading state if:
  // 1. Auth is still loading
  // 2. Not initialized yet
  // 3. Profile is loading AND we require a complete profile
  if (authLoading || !isInitialized || (requireCompleteProfile && profileLoading)) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  // If we get here, we're authenticated and profile requirements (if any) are met
  return <>{children}</>;
};

export default ProtectedRoute; 