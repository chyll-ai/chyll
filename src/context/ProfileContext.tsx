import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { ClientProfile } from '@/types/api';
import { Database } from '@/types/supabase';

interface ProfileContextType {
  profile: ClientProfile | null;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const profileData: ClientProfile = {
          client_id: data.client_id || userId,
          company_name: data.company_name || '',
          industry: data.industry || '',
          icp_title: data.icp_title || '',
          calendly_url: data.calendly_url || '',
          is_complete: data.is_complete || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      setIsLoading(true);
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user]);

  const value = {
    profile,
    isComplete: profile?.is_complete ?? false,
    isLoading,
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
