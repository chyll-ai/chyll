
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
          linkedin_profile_data,
          mrr,
          arr,
          pipeline_stage,
          close_probability,
          expected_close_date,
          last_activity_date,
          job_start_date,
          job_end_date,
          job_duration_months,
          job_description,
          job_location,
          job_company_linkedin_url,
          job_company_twitter_url,
          job_company_facebook_url,
          job_company_founded_year,
          job_company_employees_count,
          job_company_revenue,
          job_company_funding,
          job_company_tags,
          personal_emails,
          work_email,
          mobile_phone,
          work_phone,
          birth_year,
          birth_date,
          gender,
          street_address,
          city,
          state,
          postal_code,
          country,
          time_zone,
          interests,
          industry_experience,
          management_level,
          departments,
          subdepartments,
          job_functions,
          job_history,
          education_history,
          degree_names,
          school_names,
          major_fields,
          graduation_dates,
          gpa_scores,
          honors,
          activities,
          societies,
          linkedin_connections,
          linkedin_followers,
          linkedin_premium,
          linkedin_verified,
          github_followers,
          github_following,
          github_repos,
          twitter_followers,
          twitter_following,
          facebook_friends,
          social_profiles,
          patents,
          publications,
          awards,
          volunteer_work,
          recommendations_received,
          recommendations_given,
          personality_traits,
          work_preferences,
          salary_range,
          net_worth,
          investment_interests,
          technology_skills,
          software_proficiency,
          programming_languages,
          databases_used,
          frameworks_used,
          cloud_platforms,
          project_management_tools,
          design_tools,
          marketing_tools,
          sales_tools,
          communication_tools,
          mobile_devices,
          operating_systems,
          browser_preferences,
          shopping_preferences,
          travel_preferences,
          lifestyle_interests,
          media_consumption,
          political_affiliation,
          religious_beliefs,
          family_status,
          children_count,
          pet_ownership,
          home_ownership,
          vehicle_ownership,
          health_interests,
          fitness_activities,
          dietary_preferences,
          environmental_interests
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
      console.log('Updating lead status:', leadId, 'to:', status);
      
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', leadId);

      if (error) {
        console.error('Error updating lead status:', error);
        throw error;
      }
      
      console.log('Lead status updated successfully');
      
      // Refresh the leads data
      await loadLeads();
      toast.success('Statut mis à jour');
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  }, [loadLeads]);

  const updateLeadSalesData = useCallback(async (leadId: string, salesData: {
    mrr?: number;
    arr?: number;
    pipeline_stage?: string;
    close_probability?: number;
    expected_close_date?: string;
    last_activity_date?: string;
  }) => {
    try {
      console.log('Updating lead sales data:', leadId, salesData);
      
      const { error } = await supabase
        .from('leads')
        .update({
          ...salesData,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) {
        console.error('Error updating lead sales data:', error);
        throw error;
      }
      
      console.log('Lead sales data updated successfully');
      
      // Refresh the leads data
      await loadLeads();
      toast.success('Données de vente mises à jour');
    } catch (error: any) {
      console.error('Error updating lead sales data:', error);
      toast.error('Erreur lors de la mise à jour des données de vente');
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
    updateLeadSalesData,
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
