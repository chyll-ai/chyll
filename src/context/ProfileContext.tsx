import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  isComplete: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('client_profile')
        .select('*, is_complete')
        .eq('client_id', userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      setIsComplete(!!profileData?.is_complete);
    } catch (error) {
      console.error('Error checking profile:', error);
      setIsComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await checkProfile(user.id);
    }
  };

  useEffect(() => {
    if (user?.id) {
      checkProfile(user.id);
    } else {
      setIsComplete(false);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        isComplete,
        isLoading,
        refreshProfile,
      }}
    >
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