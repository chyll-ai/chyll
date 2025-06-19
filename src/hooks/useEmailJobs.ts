
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EmailJob {
  id: string;
  client_id: string;
  lead_id: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  type: 'cold_email' | 'followup_1' | 'followup_2';
  sent_at?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export const useEmailJobs = () => {
  const [emailJobs, setEmailJobs] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEmailJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmailJobs(data || []);
    } catch (error: any) {
      console.error('Error loading email jobs:', error);
      toast.error('Erreur lors du chargement des emails');
    } finally {
      setLoading(false);
    }
  };

  const createEmailJob = async (leadId: string, subject: string, body: string, type: 'cold_email' | 'followup_1' | 'followup_2' = 'cold_email') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('email_jobs')
        .insert([{
          client_id: user.id,
          lead_id: leadId,
          subject,
          body,
          type,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setEmailJobs(prev => [data, ...prev]);
      toast.success('Email job créé avec succès');
      return data;
    } catch (error: any) {
      console.error('Error creating email job:', error);
      toast.error('Erreur lors de la création de l\'email');
      throw error;
    }
  };

  useEffect(() => {
    loadEmailJobs();
  }, []);

  return {
    emailJobs,
    loading,
    loadEmailJobs,
    createEmailJob
  };
};
