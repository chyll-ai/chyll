
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

      if (error) throw error;
      
      if (data) {
        setWaitlistData(data);
        toast.success('🎉 Vous avez rejoint la liste d\'attente !');
        return data;
      }
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      if (error.message?.includes('duplicate key')) {
        toast.error('Vous êtes déjà sur la liste d\'attente !');
      } else {
        toast.error('Erreur lors de l\'inscription');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadWaitlistData = async () => {
    try {
      const { data, error } = await supabase.rpc('get_waitlist_data');
      if (error) throw error;
      if (data) {
        setWaitlistData(data);
      }
    } catch (error) {
      console.error('Error loading waitlist data:', error);
    }
  };

  const updateDiscordStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('update_discord_status');
      if (error) throw error;
      if (data) {
        setWaitlistData(data);
        toast.success('🎉 +50 points ajoutés !');
      }
    } catch (error) {
      console.error('Error updating Discord status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return {
    waitlistData,
    loading,
    joinWaitlist,
    loadWaitlistData,
    updateDiscordStatus
  };
};
