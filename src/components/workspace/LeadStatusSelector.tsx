
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/assistant';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface LeadStatusSelectorProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'nouveau':
      case 'new':
      case 'à contacter':
        return 'bg-blue-100 text-blue-800';
      case 'email envoyé':
        return 'bg-yellow-100 text-yellow-800';
      case 'à relancer':
        return 'bg-orange-100 text-orange-800';
      case 'répondu':
        return 'bg-green-100 text-green-800';
      case 'rdv':
        return 'bg-purple-100 text-purple-800';
      case 'rdv manqué':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Select value={lead.status || 'nouveau'} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <Badge className={`${getStatusColor(lead.status)} text-xs`}>
            {lead.status || 'Nouveau'}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nouveau">Nouveau</SelectItem>
        <SelectItem value="à contacter">À contacter</SelectItem>
        <SelectItem value="email envoyé">Email envoyé</SelectItem>
        <SelectItem value="à relancer">À relancer</SelectItem>
        <SelectItem value="répondu">Répondu</SelectItem>
        <SelectItem value="rdv">RDV</SelectItem>
        <SelectItem value="rdv manqué">RDV manqué</SelectItem>
        <SelectItem value="archived">Archivé</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelector;
