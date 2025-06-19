
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface WaitlistData {
  id: string;
  email: string;
  referral_code: string;
  points: number;
  waitlist_position: number;
  referral_count: number;
  discord_joined: boolean;
}

export const useWaitlist = () => {
  const [waitlistData, setWaitlistData] = useState<WaitlistData | null>(null);
  const [loading, setLoading] = useState(false);

  const joinWaitlist = async (email: string, referralCode?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('handle_waitlist_signup', {
        p_email: email,
        p_referral_code: referralCode || null
      });

      if (error) {
        console.error('Waitlist signup error:', error);
        
        // Handle specific error messages
        if (error.message?.includes('duplicate key')) {
          toast.error('Vous êtes déjà sur la liste d\'attente !');
        } else {
          toast.error('Erreur lors de l\'inscription');
        }
        throw error;
      }
      
      if (data) {
        setWaitlistData(data);
        toast.success('🎉 Vous avez rejoint la liste d\'attente !');
        
        // Store email in localStorage for future reference
        localStorage.setItem('waitlist_email', email);
        
        return data;
      }
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadWaitlistData = async (email?: string) => {
    try {
      // Try to get email from parameter or localStorage
      const targetEmail = email || localStorage.getItem('waitlist_email');
      if (!targetEmail) return;

      const { data, error } = await supabase.rpc('get_waitlist_data_by_email', {
        p_email: targetEmail
      });
      
      if (error) {
        console.error('Load waitlist data error:', error);
        return;
      }
      
      if (data) {
        setWaitlistData(data);
      }
    } catch (error) {
      console.error('Error loading waitlist data:', error);
    }
  };

  const updateCircleStatus = async () => {
    try {
      if (!waitlistData?.email) {
        toast.error('Email introuvable');
        return;
      }

      // For now, we'll just update the local state since Circle integration requires auth
      // This would need to be implemented with a different approach for anonymous users
      toast.info('Fonctionnalité Circle disponible après inscription complète');
      
    } catch (error) {
      console.error('Error updating Circle status:', error);
      throw error;
    }
  };

  return {
    waitlistData,
    loading,
    joinWaitlist,
    loadWaitlistData,
    updateCircleStatus
  };
};
