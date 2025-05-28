
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, History, Calendar, Phone, CheckCircle, XCircle, Eye } from 'lucide-react';
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

    // Status-specific actions
    if (status === 'à contacter' || status === 'à relancer') {
      actions.push(
        <Button key="email" variant="outline" size="sm" onClick={handleSendEmail}>
          <Mail className="h-3 w-3 mr-1" />
          Email
        </Button>
      );
    }

    if (status === 'email envoyé' || status === 'à relancer') {
      actions.push(
        <Button key="followup" variant="outline" size="sm" onClick={handleSendFollowup}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Relance
        </Button>
      );
    }

    if (status === 'email envoyé' || status === 'répondu') {
      actions.push(
        <Button key="schedule" variant="outline" size="sm" onClick={handleScheduleCall}>
          <Calendar className="h-3 w-3 mr-1" />
          Appel
        </Button>
      );
    }

    // Status update actions
    if (status !== 'répondu') {
      actions.push(
        <Button key="responded" variant="outline" size="sm" onClick={handleMarkAsResponded}>
          <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
          Répondu
        </Button>
      );
    }

    if (status === 'appel prévu' || status === 'répondu') {
      actions.push(
        <Button key="meeting" variant="outline" size="sm" onClick={handleMarkAsMeeting}>
          <Calendar className="h-3 w-3 mr-1 text-blue-600" />
          RDV
        </Button>
      );
    }

    if (status === 'rdv') {
      actions.push(
        <Button key="missed" variant="outline" size="sm" onClick={handleMarkAsMissedMeeting}>
          <XCircle className="h-3 w-3 mr-1 text-red-600" />
          RDV manqué
        </Button>
      );
    }

    // Always available actions
    actions.push(
      <Button key="history" variant="outline" size="sm" onClick={handleViewHistory}>
        <History className="h-3 w-3 mr-1" />
        Historique
      </Button>
    );

    return actions;
  };

  return (
    <div className="flex flex-wrap gap-1 min-w-max">
      {getAvailableActions()}
    </div>
  );
};

export default LeadActionsMenu;
