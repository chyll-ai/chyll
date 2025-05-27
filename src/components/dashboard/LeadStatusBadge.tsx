
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LeadStatusBadgeProps {
  status: string;
}

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status }) => {
  let className = '';
  
  switch (status?.toLowerCase()) {
    case 'à contacter':
      className = 'bg-slate-100 text-slate-800 border-slate-200';
      break;
    case 'email envoyé':
      className = 'bg-blue-100 text-blue-800 border-blue-200';
      break;
    case 'répondu':
      className = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'à relancer':
      className = 'bg-orange-100 text-orange-800 border-orange-200';
      break;
    case 'appel prévu':
      className = 'bg-purple-100 text-purple-800 border-purple-200';
      break;
    case 'rdv':
      className = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      break;
    case 'rdv manqué':
      className = 'bg-red-100 text-red-800 border-red-200';
      break;
    default:
      className = 'bg-slate-100 text-slate-800 border-slate-200';
  }
  
  return (
    <Badge variant="outline" className={`${className} font-medium text-xs whitespace-nowrap`}>
      {status || 'À contacter'}
    </Badge>
  );
};

export default LeadStatusBadge;
