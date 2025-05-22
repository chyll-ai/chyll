
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LeadStatusBadgeProps {
  status: string;
}

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status }) => {
  let className = '';
  
  switch (status?.toLowerCase()) {
    case 'à contacter':
      className = 'bg-gray-100 text-gray-800';
      break;
    case 'email envoyé':
      className = 'bg-blue-100 text-blue-800';
      break;
    case 'répondu':
      className = 'bg-green-100 text-green-800';
      break;
    case 'à relancer':
      className = 'bg-amber-100 text-amber-800';
      break;
    case 'appel prévu':
      className = 'bg-purple-100 text-purple-800';
      break;
    case 'rdv':
      className = 'bg-emerald-100 text-emerald-800';
      break;
    case 'rdv manqué':
      className = 'bg-red-100 text-red-800';
      break;
    default:
      className = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <Badge variant="outline" className={`${className} font-normal`}>
      {status || 'À contacter'}
    </Badge>
  );
};

export default LeadStatusBadge;
