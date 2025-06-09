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

  // Dummy client profile data for Chyll.ai
  const dummyClientProfile = {
    full_name: 'Alexandre Martin',
    job_title: 'CEO & Founder',
    company_name: 'Chyll.ai',
    industry: 'Intelligence Artificielle',
    value_proposition: 'Solution d\'IA pour automatiser la prospection commerciale et générer des leads qualifiés',
    expertise_areas: ['Intelligence Artificielle', 'Prospection commerciale', 'Automation marketing'],
    achievements: ['Lancé Chyll.ai avec 500+ clients', 'Expert en automatisation IA', '10 ans d\'expérience en tech'],
    company_description: 'Chyll.ai est une plateforme innovante qui utilise l\'IA pour révolutionner la prospection commerciale',
    unique_selling_points: ['IA avancée pour la prospection', 'Automatisation complète du processus', 'ROI mesurable'],
    preferred_meeting_duration: '30 minutes'
  };

  const generateColdEmailContent = (lead: Lead) => {
    return `Bonjour ${lead.full_name},

Je suis ${dummyClientProfile.full_name}, ${dummyClientProfile.job_title} chez ${dummyClientProfile.company_name}.

J'ai découvert votre profil et votre rôle de ${lead.job_title} chez ${lead.company}, et je pense que notre solution pourrait vous intéresser.

${dummyClientProfile.company_description}. Notre plateforme utilise une IA avancée pour automatiser la prospection commerciale, permettant aux entreprises comme ${lead.company} de générer plus de leads qualifiés tout en économisant du temps.

Nos clients dans le secteur ont vu une augmentation moyenne de 40% de leurs leads qualifiés grâce à notre automatisation intelligente.

Seriez-vous disponible pour un échange de ${dummyClientProfile.preferred_meeting_duration} la semaine prochaine ? J'aimerais vous montrer comment nous pourrions optimiser votre processus de prospection.

Cordialement,
${dummyClientProfile.full_name}
${dummyClientProfile.job_title}
${dummyClientProfile.company_name}`;
  };

  const generateFollowupContent = (lead: Lead) => {
    return `Bonjour ${lead.full_name},

J'espère que vous allez bien. Je reviens vers vous concernant mon message précédent sur notre solution d'automatisation de prospection chez ${dummyClientProfile.company_name}.

Je comprends que vous êtes certainement très occupé(e) dans votre rôle de ${lead.job_title}. C'est justement pourquoi notre solution pourrait vous faire gagner un temps précieux.

En résumé, nous aidons des entreprises comme ${lead.company} à :
• Automatiser leur prospection commerciale
• Générer 40% de leads qualifiés en plus
• Économiser 15h par semaine sur les tâches répétitives

Je serais ravi de vous présenter notre approche lors d'un bref échange de ${dummyClientProfile.preferred_meeting_duration}. Auriez-vous un créneau cette semaine ou la suivante ?

Cordialement,
${dummyClientProfile.full_name}
${dummyClientProfile.job_title}
${dummyClientProfile.company_name}`;
  };

  const handleSendEmail = async () => {
    try {
      console.log('Starting fake email generation for lead:', lead.id);
      const emailContent = generateColdEmailContent(lead);
      
      const emailData = {
        lead_id: lead.id,
        client_id: lead.client_id,
        type: 'cold_email',
        status: 'sent',
        subject: 'Optimisez votre prospection commerciale avec l\'IA',
        body: emailContent
      };

      console.log('Email data to insert:', emailData);
      
      // Save the fake email to email_jobs table
      const { data, error } = await supabase
        .from('email_jobs')
        .insert(emailData)
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Email job created successfully:', data);

      // Update lead status
      await updateLeadStatus('email envoyé');
      
      toast.success('Email de prospection généré et envoyé (demo)');
    } catch (error: any) {
      console.error('Error generating fake email:', error);
      toast.error(`Erreur lors de la génération de l'email: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSendFollowup = async () => {
    try {
      console.log('Starting fake followup generation for lead:', lead.id);
      const emailContent = generateFollowupContent(lead);
      
      // Get the last email for this lead to create a thread
      const { data: lastEmail } = await supabase
        .from('email_jobs')
        .select('subject')
        .eq('lead_id', lead.id)
        .order('sent_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const emailData = {
        lead_id: lead.id,
        client_id: lead.client_id,
        type: 'followup',
        status: 'sent',
        subject: lastEmail ? `Re: ${lastEmail.subject}` : 'Re: Optimisez votre prospection commerciale avec l\'IA',
        body: emailContent
      };

      console.log('Followup email data to insert:', emailData);

      // Save the fake followup email
      const { data, error } = await supabase
        .from('email_jobs')
        .insert(emailData)
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Followup email job created successfully:', data);

      // Update lead status
      await updateLeadStatus('à relancer');
      
      toast.success('Email de relance généré et envoyé (demo)');
    } catch (error: any) {
      console.error('Error generating fake followup:', error);
      toast.error(`Erreur lors de la génération de la relance: ${error.message || 'Unknown error'}`);
    }
  };

  const handleScheduleCall = async () => {
    try {
      toast.info('Fonctionnalité de planification d\'appel à implémenter');
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
    if (status === 'à contacter' || status === 'new') {
      actions.push(
        <Button key="email" variant="outline" size="sm" onClick={handleSendEmail}>
          <Mail className="h-3 w-3 mr-1" />
          Email (demo)
        </Button>
      );
    }

    if (status === 'email envoyé' || status === 'à relancer') {
      actions.push(
        <Button key="followup" variant="outline" size="sm" onClick={handleSendFollowup}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Relance (demo)
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
