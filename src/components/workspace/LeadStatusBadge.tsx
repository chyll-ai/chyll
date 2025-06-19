
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LeadStatusBadgeProps {
  status: string;
}

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'nouveau':
      case 'new':
      case 'à contacter':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'email envoyé':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'à relancer':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'répondu':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rdv':
      case 'appel prévu':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rdv manqué':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'nouveau':
      case 'new':
        return 'Nouveau';
      case 'à contacter':
        return 'À contacter';
      case 'email envoyé':
        return 'Email envoyé';
      case 'à relancer':
        return 'À relancer';
      case 'répondu':
        return 'Répondu';
      case 'rdv':
        return 'RDV';
      case 'appel prévu':
        return 'Appel prévu';
      case 'rdv manqué':
        return 'RDV manqué';
      case 'archived':
        return 'Archivé';
      default:
        return status || 'Inconnu';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor(status)} text-xs font-medium`}>
      {getStatusLabel(status)}
    </Badge>
  );
};

export default LeadStatusBadge;
