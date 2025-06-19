
import React from 'react';
import { MoreHorizontal, Mail, Calendar, Archive, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/assistant';
import { useNavigate } from 'react-router-dom';

interface LeadActionsMenuProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

const LeadActionsMenu: React.FC<LeadActionsMenuProps> = ({ lead, onStatusUpdate }) => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate(`/lead-history/${lead.id}`);
  };

  const handleSendEmail = () => {
    // This will be implemented later
    console.log('Send email to:', lead.email);
  };

  const handleScheduleCall = () => {
    // This will be implemented later
    console.log('Schedule call with:', lead.full_name);
  };

  const handleArchive = () => {
    onStatusUpdate(lead.id, 'archived');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewHistory}>
          <Eye className="h-4 w-4 mr-2" />
          Voir l'historique
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Envoyer email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleScheduleCall}>
          <Calendar className="h-4 w-4 mr-2" />
          Planifier appel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleArchive}>
          <Archive className="h-4 w-4 mr-2" />
          Archiver
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeadActionsMenu;
