import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { ClientProfile } from '@/types/api';
import { toast } from '@/components/ui/sonner';

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
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        throw error;
      }

      if (data) {
        console.log('Profile loaded:', data);
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
        console.log('No profile found, creating default profile');
        // Create a default profile if none exists
        const { data: newProfile, error: createError } = await supabase
          .from('client_profile')
          .insert({
            client_id: userId,
            is_complete: false
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating default profile:', createError);
          toast.error('Failed to create profile');
          throw createError;
        }

        setProfile({
          client_id: newProfile.client_id,
          company_name: '',
          industry: '',
          icp_title: '',
          calendly_url: '',
          is_complete: false,
          created_at: newProfile.created_at,
          updated_at: newProfile.updated_at
        });
      }
    } catch (error) {
      console.error('Error in profile fetch/create:', error);
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
