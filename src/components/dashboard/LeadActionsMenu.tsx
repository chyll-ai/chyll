
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/assistant';
import { Mail, Phone, Calendar, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface LeadActionsMenuProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

const LeadActionsMenu: React.FC<LeadActionsMenuProps> = ({ lead, onStatusUpdate }) => {
  const getAvailableActions = (status: string) => {
    switch (status) {
      case 'à contacter':
        return ['email', 'call'];
      case 'email envoyé':
        return ['follow-up', 'call', 'schedule'];
      case 'répondu':
        return ['schedule', 'call', 'follow-up'];
      case 'à relancer':
        return ['follow-up', 'call'];
      case 'appel prévu':
        return ['call', 'reschedule'];
      case 'rdv':
        return ['follow-up'];
      case 'rdv manqué':
        return ['reschedule', 'follow-up', 'call'];
      default:
        return ['email', 'call'];
    }
  };

  const handleAction = async (action: string) => {
    let newStatus = lead.status;
    
    switch (action) {
      case 'email':
        if (lead.email) {
          window.open(`mailto:${lead.email}`);
          newStatus = 'email envoyé';
        } else {
          toast.error('Aucun email disponible');
          return;
        }
        break;
      case 'call':
        if (lead.phone_number) {
          window.open(`tel:${lead.phone_number}`);
          newStatus = 'appel prévu';
        } else {
          toast.error('Aucun numéro de téléphone disponible');
          return;
        }
        break;
      case 'follow-up':
        newStatus = 'à relancer';
        toast.success('Relance programmée');
        break;
      case 'schedule':
        newStatus = 'rdv';
        toast.success('RDV programmé');
        break;
      case 'reschedule':
        newStatus = 'appel prévu';
        toast.success('RDV reprogrammé');
        break;
    }

    if (newStatus !== lead.status) {
      onStatusUpdate(lead.id, newStatus);
    }
  };

  const availableActions = getAvailableActions(lead.status);

  const actionButtons = {
    email: (
      <Button
        key="email"
        variant="outline"
        size="sm"
        onClick={() => handleAction('email')}
        className="h-7 text-xs px-2"
        disabled={!lead.email}
      >
        <Mail className="h-3 w-3 mr-1" />
        Email
      </Button>
    ),
    call: (
      <Button
        key="call"
        variant="outline"
        size="sm"
        onClick={() => handleAction('call')}
        className="h-7 text-xs px-2"
        disabled={!lead.phone_number}
      >
        <Phone className="h-3 w-3 mr-1" />
        Appeler
      </Button>
    ),
    'follow-up': (
      <Button
        key="follow-up"
        variant="outline"
        size="sm"
        onClick={() => handleAction('follow-up')}
        className="h-7 text-xs px-2"
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Relancer
      </Button>
    ),
    schedule: (
      <Button
        key="schedule"
        variant="outline"
        size="sm"
        onClick={() => handleAction('schedule')}
        className="h-7 text-xs px-2"
      >
        <Calendar className="h-3 w-3 mr-1" />
        RDV
      </Button>
    ),
    reschedule: (
      <Button
        key="reschedule"
        variant="outline"
        size="sm"
        onClick={() => handleAction('reschedule')}
        className="h-7 text-xs px-2"
      >
        <Calendar className="h-3 w-3 mr-1" />
        Reprogrammer
      </Button>
    )
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {availableActions.map(action => actionButtons[action as keyof typeof actionButtons])}
      {lead.linkedin_url && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(lead.linkedin_url, '_blank')}
          className="h-7 text-xs px-2"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          LinkedIn
        </Button>
      )}
    </div>
  );
};

export default LeadActionsMenu;
