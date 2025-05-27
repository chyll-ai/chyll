
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, RefreshCw, History } from 'lucide-react';
import { Lead } from '@/types/assistant';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface LeadActionsMenuProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

const LeadActionsMenu: React.FC<LeadActionsMenuProps> = ({ lead, onStatusUpdate }) => {
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      // TODO: Implement send email functionality
      toast.info('Fonctionnalité d\'envoi d\'email à implémenter');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleSendFollowup = async () => {
    try {
      // TODO: Implement send followup functionality
      toast.info('Fonctionnalité de relance à implémenter');
    } catch (error: any) {
      console.error('Error sending followup:', error);
      toast.error('Erreur lors de l\'envoi de la relance');
    }
  };

  const handleViewHistory = () => {
    navigate(`/lead-history/${lead.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewHistory}>
          <History className="h-4 w-4 mr-2" />
          Voir l'historique
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Envoyer un email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendFollowup}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Envoyer une relance
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeadActionsMenu;
