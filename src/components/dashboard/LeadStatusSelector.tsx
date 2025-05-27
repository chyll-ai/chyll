
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead } from '@/types/assistant';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface LeadStatusSelectorProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

const statusOptions = [
  { value: 'à contacter', label: 'À contacter' },
  { value: 'email envoyé', label: 'Email envoyé' },
  { value: 'répondu', label: 'Répondu' },
  { value: 'à relancer', label: 'À relancer' },
  { value: 'appel prévu', label: 'Appel prévu' },
  { value: 'rdv', label: 'RDV' },
  { value: 'rdv manqué', label: 'RDV manqué' }
];

const LeadStatusSelector: React.FC<LeadStatusSelectorProps> = ({ lead, onStatusUpdate }) => {
  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', lead.id);

      if (error) throw error;

      onStatusUpdate(lead.id, newStatus);
      toast.success('Statut mis à jour');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  return (
    <Select value={lead.status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelector;
