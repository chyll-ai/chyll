
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Lead {
  id: string;
  full_name?: string;
  email?: string;
  linkedin_url?: string;
  company?: string;
  status: string;
}

export const usePDLEnrichment = () => {
  const [enriching, setEnriching] = useState(false);
  const [bulkEnriching, setBulkEnriching] = useState(false);

  const enrichLead = async (leadId: string) => {
    try {
      setEnriching(true);
      
      // Get lead data first
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('id, full_name, email, linkedin_url, company')
        .eq('id', leadId)
        .single();

      if (leadError || !lead) {
        throw new Error('Lead not found');
      }

      console.log('Enriching lead with PDL:', leadId);

      // Call PDL enrichment function
      const { data: enrichmentResult, error: enrichmentError } = await supabase.functions
        .invoke('pdl-enrichment', {
          body: {
            leadId: lead.id,
            email: lead.email,
            linkedin_url: lead.linkedin_url,
            full_name: lead.full_name,
            company: lead.company
          }
        });

      if (enrichmentError) {
        throw enrichmentError;
      }

      if (!enrichmentResult.success) {
        throw new Error(enrichmentResult.error || 'Enrichment failed');
      }

      const enrichment = enrichmentResult.enrichment;
      
      // Update lead with enriched data
      const updateData: any = {
        status: 'enriched',
        updated_at: new Date().toISOString()
      };

      if (enrichment) {
        // Update basic fields if we got better data
        if (enrichment.job_title) updateData.job_title = enrichment.job_title;
        if (enrichment.job_company_name) updateData.company = enrichment.job_company_name;
        if (enrichment.location_name) updateData.location = enrichment.location_name;
        
        // Update email if we got a better one
        if (enrichment.emails && enrichment.emails.length > 0) {
          const primaryEmail = enrichment.emails.find((e: any) => e.type === 'primary') || enrichment.emails[0];
          if (primaryEmail) updateData.email = primaryEmail.address;
        }

        // Update phone if we got one
        if (enrichment.phone_numbers && enrichment.phone_numbers.length > 0) {
          const primaryPhone = enrichment.phone_numbers.find((p: any) => p.type === 'mobile') || enrichment.phone_numbers[0];
          if (primaryPhone) updateData.phone_number = primaryPhone.number;
        }

        // Store detailed LinkedIn profile data
        updateData.linkedin_profile_data = {
          linkedin_url: enrichment.linkedin_url,
          summary: enrichment.summary,
          skills: enrichment.skills || [],
          experience: enrichment.experience || [],
          education: enrichment.education || []
        };
      }

      const { error: updateError } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId);

      if (updateError) throw updateError;
      
      toast.success('Lead enrichi avec succès via People Data Labs');
      return enrichmentResult;
    } catch (error: any) {
      console.error('Error enriching lead with PDL:', error);
      toast.error('Erreur lors de l\'enrichissement: ' + (error.message || 'Erreur inconnue'));
      throw error;
    } finally {
      setEnriching(false);
    }
  };

  const bulkEnrichLeads = async (leadIds: string[]) => {
    try {
      setBulkEnriching(true);
      
      let successCount = 0;
      let errorCount = 0;

      for (const leadId of leadIds) {
        try {
          await enrichLead(leadId);
          successCount++;
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to enrich lead ${leadId}:`, error);
          errorCount++;
        }
      }
      
      toast.success(`Enrichissement terminé: ${successCount} réussis, ${errorCount} échecs`);
    } catch (error: any) {
      console.error('Error bulk enriching leads with PDL:', error);
      toast.error('Erreur lors de l\'enrichissement en masse');
    } finally {
      setBulkEnriching(false);
    }
  };

  return {
    enriching,
    bulkEnriching,
    enrichLead,
    bulkEnrichLeads
  };
};
