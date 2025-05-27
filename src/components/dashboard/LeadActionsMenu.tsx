
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, RefreshCw, History, Calendar, Phone, CheckCircle, XCircle, Eye } from 'lucide-react';
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
      // Update status to "email envoyé" after sending
      await updateLeadStatus('email envoyé');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleSendFollowup = async () => {
    try {
      // TODO: Implement send followup functionality
      toast.info('Fonctionnalité de relance à implémenter');
      // Update status to "à relancer" after sending followup
      await updateLeadStatus('à relancer');
    } catch (error: any) {
      console.error('Error sending followup:', error);
      toast.error('Erreur lors de l\'envoi de la relance');
    }
  };

  const handleScheduleCall = async () => {
    try {
      // TODO: Implement schedule call functionality
      toast.info('Fonctionnalité de planification d\'appel à implémenter');
      // Update status to "appel prévu"
      await updateLeadStatus('appel prévu');
    } catch (error: any) {
      console.error('Error scheduling call:', error);
      toast.error('Erreur lors de la planification de l\'appel');
    }
  };

  const handleMarkAsResponded = async () => {
    try {
      await updateLeadStatus('répondu');
      toast.success('Lead marqué comme ayant répondu');
    } catch (error: any) {
      console.error('Error marking as responded:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleMarkAsMeeting = async () => {
    try {
      await updateLeadStatus('rdv');
      toast.success('Lead marqué comme RDV');
    } catch (error: any) {
      console.error('Error marking as meeting:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleMarkAsMissedMeeting = async () => {
    try {
      await updateLeadStatus('rdv manqué');
      toast.success('Lead marqué comme RDV manqué');
    } catch (error: any) {
      console.error('Error marking as missed meeting:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const updateLeadStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', lead.id);

    if (error) throw error;
    onStatusUpdate(lead.id, newStatus);
  };

  const handleViewHistory = () => {
    navigate(`/lead-history/${lead.id}`);
  };

  const getAvailableActions = () => {
    const status = lead.status?.toLowerCase();
    const actions = [];

    // Always available actions
    actions.push(
      <DropdownMenuItem key="history" onClick={handleViewHistory}>
        <History className="h-4 w-4 mr-2" />
        Voir l'historique
      </DropdownMenuItem>
    );

    // Status-specific actions
    if (status === 'à contacter' || status === 'à relancer') {
      actions.push(
        <DropdownMenuItem key="email" onClick={handleSendEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Envoyer un email
        </DropdownMenuItem>
      );
    }

    if (status === 'email envoyé' || status === 'à relancer') {
      actions.push(
        <DropdownMenuItem key="followup" onClick={handleSendFollowup}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Envoyer une relance
        </DropdownMenuItem>
      );
    }

    if (status === 'email envoyé' || status === 'répondu') {
      actions.push(
        <DropdownMenuItem key="schedule" onClick={handleScheduleCall}>
          <Calendar className="h-4 w-4 mr-2" />
          Planifier un appel
        </DropdownMenuItem>
      );
    }

    // Status update actions
    if (status !== 'répondu') {
      actions.push(<DropdownMenuSeparator key="sep1" />);
      actions.push(
        <DropdownMenuItem key="responded" onClick={handleMarkAsResponded}>
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          Marquer comme répondu
        </DropdownMenuItem>
      );
    }

    if (status === 'appel prévu' || status === 'répondu') {
      actions.push(
        <DropdownMenuItem key="meeting" onClick={handleMarkAsMeeting}>
          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
          Marquer comme RDV
        </DropdownMenuItem>
      );
    }

    if (status === 'rdv') {
      actions.push(
        <DropdownMenuItem key="missed" onClick={handleMarkAsMissedMeeting}>
          <XCircle className="h-4 w-4 mr-2 text-red-600" />
          Marquer RDV manqué
        </DropdownMenuItem>
      );
    }

    return actions;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {getAvailableActions()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeadActionsMenu;
