
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Lead {
  id: string;
  full_name: string;
  email?: string;
  company?: string;
  status: string;
}

export const useApolloEnrichment = () => {
  const [enriching, setEnriching] = useState(false);
  const [bulkEnriching, setBulkEnriching] = useState(false);

  // Simulation d'enrichissement pour la démo
  const enrichLead = async (leadId: string) => {
    try {
      setEnriching(true);
      
      // Simulation d'un appel Apollo API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Données simulées d'enrichissement
      const mockEnrichment = {
        linkedin_profile_data: {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          experience: '5+ years',
          skills: ['React', 'Node.js', 'Python'],
          location: 'Paris, France'
        }
      };

      const { error } = await supabase
        .from('leads')
        .update({ 
          status: 'enriched',
          linkedin_profile_data: mockEnrichment.linkedin_profile_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      
      toast.success('Lead enrichi avec succès');
    } catch (error: any) {
      console.error('Error enriching lead:', error);
      toast.error('Erreur lors de l\'enrichissement');
    } finally {
      setEnriching(false);
    }
  };

  const bulkEnrichLeads = async (leadIds: string[]) => {
    try {
      setBulkEnriching(true);
      
      for (const leadId of leadIds) {
        await enrichLead(leadId);
        // Pause entre les enrichissements
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast.success(`${leadIds.length} leads enrichis avec succès`);
    } catch (error: any) {
      console.error('Error bulk enriching leads:', error);
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
