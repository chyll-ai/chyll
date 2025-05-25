import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { ClientProfile } from '@/types/api';
import { Database } from '@/types/supabase';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

interface ProfileContextType {
  profile: ClientProfile | null;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const ProfileErrorFallback = ({ error, retry }: { error: string; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <p className="text-red-500 mb-4">{error}</p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      Try Again
    </button>
  </div>
);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProfile = async (userId: string) => {
    let shouldRetry = false;
    let shouldClearProfile = false;
    
    setIsLoading(true);
    
    try {
      console.log('ProfileContext: Fetching profile for user:', {
        userId,
        hasAccessToken: !!session?.access_token,
        retryCount,
        sessionExpiry: session?.expires_at,
        currentTime: new Date().toISOString()
      });

      // Early exit conditions - all handled within try block
      if (!session?.access_token) {
        console.error('ProfileContext: No valid access token available');
        setError('Authentication token not available. Please try logging in again.');
        shouldClearProfile = true;
        return;
      }

      // First verify the user exists in clients table
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (clientError) {
        console.error('ProfileContext: Error verifying client record:', {
          error: clientError,
          message: clientError.message,
          code: clientError.code,
          details: clientError.details
        });
        setError('Error verifying user record');
        shouldRetry = true;
        shouldClearProfile = true;
        return;
      }

      if (!clientData) {
        console.error('ProfileContext: Client record not found for user:', userId);
        setError('User record not found');
        shouldRetry = true;
        shouldClearProfile = true;
        return;
      }

      // Now fetch the profile - missing profile is an expected state
      const { data, error: fetchError } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      console.log('ProfileContext: Profile fetch response:', {
        hasData: !!data,
        error: fetchError,
        statusCode: fetchError?.code,
        message: fetchError?.message,
        details: fetchError?.details,
        clientId: userId,
        dataClientId: data?.client_id
      });

      // Handle specific error cases
      if (fetchError) {
        // 404/406 means profile doesn't exist - this is expected for new users
        if (fetchError.code === '404' || fetchError.code === '406') {
          console.log('ProfileContext: Profile not found (expected for new users):', {
            error: fetchError,
            code: fetchError.code
          });
          shouldClearProfile = true;
          setError(null);
          return;
        }

        // 401 means unauthorized - user needs to log in again
        if (fetchError.code === '401') {
          console.error('ProfileContext: Unauthorized access to profile:', {
            error: fetchError,
            message: fetchError.message,
            details: fetchError.details,
            sessionExpiry: session?.expires_at
          });
          setError('Session expired. Please log in again.');
          toast.error('Session expired. Please log in again.');
          shouldClearProfile = true;
          return;
        }

        // 403 means forbidden - RLS policy blocking access
        if (fetchError.code === '403') {
          console.error('ProfileContext: Forbidden access to profile (RLS policy):', {
            error: fetchError,
            message: fetchError.message,
            details: fetchError.details,
            userId,
            clientId: data?.client_id
          });
          setError('Access denied. Please check permissions.');
          toast.error('Access denied');
          shouldRetry = true;
          shouldClearProfile = true;
          return;
        }

        // Any other error should trigger a retry
        console.error('ProfileContext: Error fetching profile:', {
          error: fetchError,
          message: fetchError.message,
          details: fetchError.details
        });
        setError('Failed to load profile. Please try again.');
        toast.error('Failed to load profile');
        shouldRetry = true;
        shouldClearProfile = true;
        return;
      }

      // Profile exists - parse and set it
      if (data) {
        const profileData: ClientProfile = {
          client_id: data.client_id || userId,
          company_name: data.company_name || '',
          industry: data.industry || '',
          icp_title: data.icp_title || '',
          calendly_url: data.calendly_url || '',
          is_complete: data.is_complete || false,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString()
        };
        
        console.log('ProfileContext: Setting profile data:', {
          clientId: profileData.client_id,
          isComplete: profileData.is_complete,
          hasCompanyName: !!profileData.company_name
        });
        
        setProfile(profileData);
        setError(null);
      } else {
        // No data but also no error - profile doesn't exist yet
        console.log('ProfileContext: No profile exists yet for user:', userId);
        shouldClearProfile = true;
      }
      
      setLastFetchTime(Date.now());
      setRetryCount(0);
    } catch (err: any) {
      console.error('ProfileContext: Unexpected error:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      setError('An unexpected error occurred. Please try again.');
      toast.error('Unexpected error loading profile');
      shouldRetry = true;
      shouldClearProfile = true;
    } finally {
      // Always clear profile if needed
      if (shouldClearProfile) {
        console.log('ProfileContext: Clearing profile state');
        setProfile(null);
      }
      
      // Always set loading to false
      setIsLoading(false);
      
      // Handle retries outside the main try/catch
      if (shouldRetry && retryCount < 3) {
        console.log('ProfileContext: Scheduling retry...');
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchProfile(userId), 1000 * Math.pow(2, retryCount));
      }
    }
  };

  const refreshProfile = async () => {
    if (user?.id && session?.access_token) {
      setRetryCount(0); // Reset retry count on manual refresh
      await fetchProfile(user.id);
    }
  };

  // Split the initialization logic into two effects:
  // 1. Handle auth loading state changes
  useEffect(() => {
    console.log('ProfileContext: Auth loading state changed:', {
      authLoading,
      hasUser: !!user,
      hasSession: !!session,
      hasAccessToken: !!session?.access_token,
      currentError: error
    });

    // Clear profile when auth is loading or no user
    if (authLoading || !user) {
      console.log('ProfileContext: Clearing profile state due to auth loading or no user');
      setProfile(null);
      setIsLoading(false);
      setError(null);
    }
  }, [authLoading, user, session]);

  // 2. Handle profile fetching once auth is ready
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeProfile = async () => {
      // Only proceed if auth is ready and we have a user
      if (!mounted) return;

      if (authLoading) {
        console.log('ProfileContext: Auth still loading, will retry');
        return;
      }

      if (!user?.id || !session?.access_token) {
        console.log('ProfileContext: Missing user or session:', {
          hasUser: !!user,
          hasUserId: !!user?.id,
          hasAccessToken: !!session?.access_token
        });
        return;
      }

      console.log('ProfileContext: Ready to fetch profile:', {
        userId: user.id,
        hasAccessToken: !!session?.access_token,
        authLoading,
        currentError: error
      });

      try {
        if (mounted) {
          await fetchProfile(user.id);
        }
      } catch (err) {
        console.error('ProfileContext: Error in profile initialization:', err);
      }
    };

    // Add a small delay to ensure auth state is settled
    timeoutId = setTimeout(initializeProfile, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [authLoading, user, session, error]);

  // Show error UI if there's an error and we're not loading
  if (error && !isLoading && !authLoading) {
    return <ProfileErrorFallback error={error} retry={refreshProfile} />;
  }

  const value = {
    profile,
    isComplete: profile?.is_complete ?? false,
    isLoading: authLoading || isLoading,
    error,
    refreshProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
