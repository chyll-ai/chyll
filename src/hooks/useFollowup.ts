import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useFollowup = () => {
  const [sending, setSending] = useState(false);

  const sendFollowup = async (leadId: string) => {
    try {
      setSending(true);
      
      // Check authentication status
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        throw new Error("You need to be logged in to send follow-ups");
      }
      
      // Get client profile to check if they have a Calendly URL
      const { data: profileData, error: profileError } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', sessionData.session.user.id)
        .maybeSingle();
      
      if (profileError) {
        throw new Error("Could not access your profile information");
      }
      
      if (!profileData) {
        throw new Error("Please complete your profile first");
      }
      
      // Call the send-followup function with the lead ID
      const { data, error } = await supabase.functions.invoke('send-followup', {
        body: { 
          lead_id: leadId,
          user_id: sessionData.session.user.id
        }
      });
      
      if (error) {
        throw new Error("Failed to send follow-up message");
      }
      
      toast.success("Follow-up message sent successfully!");
      return data;
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred while processing your request");
      throw error;
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    sendFollowup
  };
}; 