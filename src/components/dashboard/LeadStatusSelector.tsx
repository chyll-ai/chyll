
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
  { value: 'à contacter', label: 'À contacter', color: 'text-slate-700' },
  { value: 'email envoyé', label: 'Email envoyé', color: 'text-blue-700' },
  { value: 'répondu', label: 'Répondu', color: 'text-green-700' },
  { value: 'à relancer', label: 'À relancer', color: 'text-orange-700' },
  { value: 'appel prévu', label: 'Appel prévu', color: 'text-purple-700' },
  { value: 'rdv', label: 'RDV', color: 'text-emerald-700' },
  { value: 'rdv manqué', label: 'RDV manqué', color: 'text-red-700' }
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

  const currentOption = statusOptions.find(option => option.value === lead.status);

  return (
    <Select value={lead.status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full min-w-[140px]">
        <SelectValue className={currentOption?.color}>
          <span className={currentOption?.color}>{currentOption?.label || 'À contacter'}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            <span className={option.color}>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelector;
