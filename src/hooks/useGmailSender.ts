
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useGmailSender = () => {
  const [sending, setSending] = useState(false);

  const sendEmail = async (to: string, subject: string, body: string) => {
    try {
      setSending(true);
      
      // Simulation d'envoi d'email via Gmail API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulation du succès
      toast.success(`Email envoyé à ${to}`);
      
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const sendBulkEmails = async (emails: Array<{to: string, subject: string, body: string}>) => {
    try {
      setSending(true);
      
      for (const email of emails) {
        await sendEmail(email.to, email.subject, email.body);
        // Pause entre les envois
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast.success(`${emails.length} emails envoyés avec succès`);
    } catch (error: any) {
      console.error('Error sending bulk emails:', error);
      toast.error('Erreur lors de l\'envoi en masse');
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    sendEmail,
    sendBulkEmails
  };
};
