import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { ClientProfile } from '@/types/api';

interface ProfileContextType {
  profile: ClientProfile | null;
  isComplete: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async (userId: string) => {
    setIsLoading(true);
    
    try {
      const { data } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (data) {
        setProfile({
          client_id: data.client_id,
          company_name: data.company_name || '',
          industry: data.industry || '',
          icp_title: data.icp_title || '',
          calendly_url: data.calendly_url || '',
          is_complete: data.is_complete || false,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  // Fetch profile when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
    }
  }, [user?.id]);

  const value = {
    profile,
    isComplete: profile?.is_complete ?? false,
    isLoading,
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
