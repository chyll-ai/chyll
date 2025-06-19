
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { usePDLEnrichment } from './usePDLEnrichment';
import { useGmailSender } from './useGmailSender';
import { useEmailJobs } from './useEmailJobs';
import { toast } from 'sonner';
import { Lead } from '@/types/assistant';

export const useAssistantActions = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { enrichLead, bulkEnrichLeads } = usePDLEnrichment();
  const { sendEmail, sendBulkEmails } = useGmailSender();
  const { createEmailJob } = useEmailJobs();

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .select(`
          id,
          client_id,
          full_name,
          email,
          phone_number,
          job_title,
          company,
          location,
          linkedin_url,
          github_url,
          twitter_url,
          facebook_url,
          job_company_industry,
          job_company_size,
          job_company_website,
          job_seniority,
          experience_years,
          headline,
          summary,
          skills,
          languages,
          education,
          certifications,
          status,
          created_at,
          enriched_from,
          email_jobs,
          linkedin_profile_data
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error: any) {
      console.error('Error loading leads:', error);
      toast.error('Erreur lors du chargement des leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterLeads = useCallback((criteria: string) => {
    const filtered = leads.filter(lead => {
      const searchTerm = criteria.toLowerCase();
      return (
        lead.full_name?.toLowerCase().includes(searchTerm) ||
        lead.company?.toLowerCase().includes(searchTerm) ||
        lead.status?.toLowerCase().includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredLeads(filtered);
    return filtered;
  }, [leads]);

  const getLeadsByStatus = useCallback((status: string) => {
    const filtered = leads.filter(lead => lead.status === status);
    setFilteredLeads(filtered);
    return filtered;
  }, [leads]);

  const getLeadsByDate = useCallback((date: string) => {
    const targetDate = new Date(date).toDateString();
    const filtered = leads.filter(lead => 
      lead.created_at && new Date(lead.created_at).toDateString() === targetDate
    );
    setFilteredLeads(filtered);
    return filtered;
  }, [leads]);

  const enrichLeadsAction = useCallback(async (leadIds?: string[]) => {
    const leadsToEnrich = leadIds || filteredLeads.map(lead => lead.id);
    await bulkEnrichLeads(leadsToEnrich);
    await loadLeads(); // Refresh leads
  }, [filteredLeads, bulkEnrichLeads, loadLeads]);

  const sendEmailsAction = useCallback(async (leadIds?: string[], subject?: string, body?: string) => {
    const leadsToEmail = leadIds ? 
      leads.filter(lead => leadIds.includes(lead.id)) : 
      filteredLeads;

    const defaultSubject = subject || "Opportunité de collaboration";
    const defaultBody = body || "Bonjour, j'aimerais discuter d'une opportunité qui pourrait vous intéresser.";

    const emails = leadsToEmail
      .filter(lead => lead.email)
      .map(lead => ({
        to: lead.email!,
        subject: defaultSubject,
        body: defaultBody.replace('{name}', lead.full_name || '')
      }));

    if (emails.length === 0) {
      toast.error('Aucun lead avec email trouvé');
      return;
    }

    // Créer les email jobs
    for (const lead of leadsToEmail.filter(l => l.email)) {
      await createEmailJob(lead.id, defaultSubject, defaultBody);
    }

    await sendBulkEmails(emails);
    await loadLeads(); // Refresh leads
  }, [leads, filteredLeads, sendBulkEmails, createEmailJob, loadLeads]);

  const updateLeadStatus = useCallback(async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;
      await loadLeads();
      toast.success('Statut mis à jour');
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  }, [loadLeads]);

  // Actions exposées à l'assistant IA
  const assistantActions = {
    loadLeads,
    filterLeads,
    getLeadsByStatus,
    getLeadsByDate,
    enrichLeadsAction,
    sendEmailsAction,
    updateLeadStatus,
    // Fonctions utilitaires
    enrichNonQualifiedLeads: () => enrichLeadsAction(leads.filter(l => l.status === 'new').map(l => l.id)),
    showSaaSLeads: () => filterLeads('saas'),
    sendFollowUpEmails: () => sendEmailsAction(leads.filter(l => l.status === 'à relancer').map(l => l.id))
  };

  return {
    leads,
    filteredLeads,
    loading,
    assistantActions
  };
};
