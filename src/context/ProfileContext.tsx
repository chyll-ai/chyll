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
    setIsLoading(true);
    
    try {
      console.log('ProfileContext: Fetching profile for user:', {
        userId,
        hasAccessToken: !!session?.access_token,
        retryCount,
        sessionExpiry: session?.expires_at,
        currentTime: new Date().toISOString()
      });

      // Verify we have a valid session
      if (!session?.access_token) {
        console.error('ProfileContext: No valid access token available');
        setError('Authentication token not available. Please try logging in again.');
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
        return;
      }

      if (!clientData) {
        console.error('ProfileContext: Client record not found for user:', userId);
        setError('User record not found');
        return;
      }

      // Now fetch the profile
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

      if (fetchError) {
        if (fetchError.code === '401') {
          console.error('ProfileContext: Unauthorized access to profile:', {
            error: fetchError,
            message: fetchError.message,
            details: fetchError.details,
            sessionExpiry: session?.expires_at
          });
          setError('Session expired. Please log in again.');
          toast.error('Session expired. Please log in again.');
          return;
        }

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
          return;
        }

        console.error('ProfileContext: Error fetching profile:', {
          error: fetchError,
          message: fetchError.message,
          details: fetchError.details
        });
        setError('Failed to load profile. Please try again.');
        toast.error('Failed to load profile');
        shouldRetry = true;
        return;
      }

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
      } else {
        // Profile doesn't exist yet - this is expected for new users
        console.log('ProfileContext: No profile exists yet for user:', userId);
        setProfile(null);
      }
      
      setError(null);
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
    } finally {
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

  useEffect(() => {
    let mounted = true;
    
    const initializeProfile = async () => {
      console.log('ProfileContext: Auth state changed:', {
        hasUser: !!user,
        userId: user?.id,
        authLoading,
        hasAccessToken: !!session?.access_token,
        currentError: error,
        isLoading
      });

      // Don't fetch while auth is still loading
      if (authLoading) {
        console.log('ProfileContext: Waiting for auth to complete...');
        return;
      }

      // Clear profile if no user
      if (!user) {
        console.log('ProfileContext: No user, clearing profile');
        if (mounted) {
          setProfile(null);
          setIsLoading(false);
          setError(null);
        }
        return;
      }

      // Only fetch if we have both user and access token
      if (user.id && session?.access_token) {
        console.log('ProfileContext: User and token available, fetching profile...');
        if (mounted) {
          await fetchProfile(user.id);
        }
      } else {
        console.log('ProfileContext: Missing user ID or access token');
        if (mounted) {
          setIsLoading(false);
          setError('Authentication required');
        }
      }
    };

    initializeProfile();
    
    return () => {
      mounted = false;
    };
  }, [user, authLoading, session, error]);

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
