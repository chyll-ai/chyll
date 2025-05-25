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
      let shouldRedirectToLogin = false;
      let shouldRedirectToAssistant = false;
      
      try {
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
          profileError,
          isInitialized
        });

        // Not authenticated - mark for redirect to login
        if (!isAuthenticated || !session?.access_token) {
          console.log('ProtectedRoute: Not authenticated, will redirect to login');
          shouldRedirectToLogin = true;
          return;
        }

        // Only wait for profile if we require it
        if (requireCompleteProfile && profileLoading) {
          setLoadingMessage('Loading profile...');
          return;
        }

        // Only handle profile errors if we require a complete profile
        if (requireCompleteProfile && profileError) {
          console.error('ProtectedRoute: Profile error:', profileError);
          setLoadingMessage('Error loading profile. Retrying...');
          return;
        }

        // Check profile requirements
        if (requireCompleteProfile) {
          // No profile exists - mark for redirect to onboarding
          if (!profile) {
            console.log('ProtectedRoute: Profile required but missing, will redirect to assistant');
            shouldRedirectToAssistant = true;
            return;
          }
          
          // Profile exists but incomplete - mark for redirect to onboarding
          if (!isComplete) {
            console.log('ProtectedRoute: Profile incomplete, will redirect to assistant');
            shouldRedirectToAssistant = true;
            return;
          }
        }

        // Verify session is still valid
        setLoadingMessage('Verifying session...');
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession?.access_token) {
          console.error('ProtectedRoute: Session validation failed:', {
            error: sessionError,
            hasAccessToken: !!currentSession?.access_token
          });
          shouldRedirectToLogin = true;
          return;
        }

        console.log('ProtectedRoute: All checks passed');
      } catch (error: any) {
        console.error('ProtectedRoute: Error in auth check:', {
          error,
          message: error.message
        });
        shouldRedirectToLogin = true;
      } finally {
        // Always set initialized to true
        setIsInitialized(true);
        
        // Handle any pending redirects
        if (shouldRedirectToLogin) {
          navigate('/login', { replace: true });
        } else if (shouldRedirectToAssistant) {
          navigate('/assistant', { replace: true });
        }
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
  // 1. Auth is still loading, or
  // 2. Not initialized yet, or
  // 3. Profile is loading AND we require a complete profile
  if (authLoading || !isInitialized || (requireCompleteProfile && profileLoading)) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  // If we get here, we're authenticated and profile requirements (if any) are met
  return <>{children}</>;
};

export default ProtectedRoute; 