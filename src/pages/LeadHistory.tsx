
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Calendar, User, Building2, MapPin, Phone, ExternalLink, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import LeadStatusBadge from '@/components/dashboard/LeadStatusBadge';

interface EmailJob {
  id: string;
  type: string;
  status: string;
  subject: string;
  body: string;
  sent_at: string;
  error?: string;
}

const LeadHistory = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [emailHistory, setEmailHistory] = useState<EmailJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (leadId) {
      fetchLeadData();
      fetchEmailHistory();
    }
  }, [leadId]);

  const fetchLeadData = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error: any) {
      console.error('Error fetching lead:', error);
      toast.error('Failed to fetch lead details');
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('email_jobs')
        .select('*')
        .eq('lead_id', leadId)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setEmailHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching email history:', error);
      toast.error('Failed to fetch email history');
    } finally {
      setIsLoading(false);
    }
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

  const updateLeadStatus = async (newStatus: string) => {
    if (!lead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', lead.id);

      if (error) throw error;

      setLead({ ...lead, status: newStatus });
      toast.success('Statut mis à jour');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSendEmail = async () => {
    if (!lead) return;

    try {
      const emailContent = generateColdEmailContent(lead);
      
      // Save the fake email to email_jobs table
      const { error } = await supabase
        .from('email_jobs')
        .insert({
          lead_id: lead.id,
          client_id: lead.client_id,
          type: 'cold_email',
          status: 'sent',
          subject: 'Optimisez votre prospection commerciale avec l\'IA',
          body: emailContent,
          sent_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      await updateLeadStatus('email envoyé');
      await fetchEmailHistory(); // Refresh email history
      
      toast.success('Email de prospection généré et envoyé (demo)');
    } catch (error: any) {
      console.error('Error generating fake email:', error);
      toast.error('Erreur lors de la génération de l\'email');
    }
  };

  const handleSendFollowup = async () => {
    if (!lead) return;

    try {
      const emailContent = generateFollowupContent(lead);
      
      // Get the last email for this lead to create a thread
      const { data: lastEmail } = await supabase
        .from('email_jobs')
        .select('subject')
        .eq('lead_id', lead.id)
        .order('sent_at', { ascending: false })
        .limit(1)
        .single();

      // Save the fake followup email
      const { error } = await supabase
        .from('email_jobs')
        .insert({
          lead_id: lead.id,
          client_id: lead.client_id,
          type: 'followup',
          status: 'sent',
          subject: lastEmail ? `Re: ${lastEmail.subject}` : 'Re: Optimisez votre prospection commerciale avec l\'IA',
          body: emailContent,
          sent_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      await updateLeadStatus('à relancer');
      await fetchEmailHistory(); // Refresh email history
      
      toast.success('Email de relance généré et envoyé (demo)');
    } catch (error: any) {
      console.error('Error generating fake followup:', error);
      toast.error('Erreur lors de la génération de la relance');
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
    } catch (error: any) {
      console.error('Error marking as responded:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleMarkAsMeeting = async () => {
    try {
      await updateLeadStatus('rdv');
    } catch (error: any) {
      console.error('Error marking as meeting:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleMarkAsMissedMeeting = async () => {
    try {
      await updateLeadStatus('rdv manqué');
    } catch (error: any) {
      console.error('Error marking as missed meeting:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmailTypeLabel = (type: string) => {
    switch (type) {
      case 'cold_email':
        return 'Email de prospection';
      case 'followup':
        return 'Email de relance';
      default:
        return 'Email';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAvailableActions = () => {
    if (!lead) return [];

    const status = lead.status?.toLowerCase();
    const actions = [];

    // Status-specific actions
    if (status === 'à contacter' || status === 'new') {
      actions.push(
        <Button key="email" onClick={handleSendEmail} className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Envoyer un email (demo)
        </Button>
      );
    }

    if (status === 'email envoyé' || status === 'à relancer') {
      actions.push(
        <Button key="followup" onClick={handleSendFollowup} variant="outline" className="flex-1">
          <RefreshCw className="h-4 w-4 mr-2" />
          Envoyer une relance (demo)
        </Button>
      );
    }

    if (status === 'email envoyé' || status === 'répondu') {
      actions.push(
        <Button key="schedule" onClick={handleScheduleCall} variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Planifier un appel
        </Button>
      );
    }

    // Status update actions
    if (status !== 'répondu') {
      actions.push(
        <Button key="responded" onClick={handleMarkAsResponded} variant="outline" className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Marquer comme répondu
        </Button>
      );
    }

    if (status === 'appel prévu' || status === 'répondu') {
      actions.push(
        <Button key="meeting" onClick={handleMarkAsMeeting} variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Marquer comme RDV
        </Button>
      );
    }

    if (status === 'rdv') {
      actions.push(
        <Button key="missed" onClick={handleMarkAsMissedMeeting} variant="outline" className="flex-1">
          <XCircle className="h-4 w-4 mr-2" />
          Marquer RDV manqué
        </Button>
      );
    }

    return actions;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
          <p className="text-xs text-muted-foreground">Loading lead history...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Lead not found</h3>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Lead History</h1>
          <p className="text-muted-foreground">View all interactions and details</p>
        </div>
      </div>

      {/* Lead Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="h-5 w-5" />
            {lead.full_name}
            <LeadStatusBadge status={lead.status} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
              </div>
            )}
            {lead.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">{lead.phone_number}</p>
                </div>
              </div>
            )}
            {lead.job_title && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Poste</p>
                  <p className="text-sm text-muted-foreground">{lead.job_title}</p>
                </div>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Entreprise</p>
                  <p className="text-sm text-muted-foreground">{lead.company}</p>
                </div>
              </div>
            )}
            {lead.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Lieu</p>
                  <p className="text-sm text-muted-foreground">{lead.location}</p>
                </div>
              </div>
            )}
            {lead.linkedin_url && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">LinkedIn</p>
                  <a 
                    href={lead.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir le profil
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date d'ajout</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(lead.created_at)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      {getAvailableActions().length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Actions disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getAvailableActions()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Mail className="h-5 w-5" />
            Historique des emails ({emailHistory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emailHistory.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun email envoyé</h3>
              <p className="text-muted-foreground">
                Aucun email n'a encore été envoyé à ce lead.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {emailHistory.map((email) => (
                <Card key={email.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">{email.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getEmailTypeLabel(email.type)} • {formatDate(email.sent_at)}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                        {email.status === 'sent' ? 'Envoyé' : 
                         email.status === 'failed' ? 'Échec' : 
                         email.status === 'pending' ? 'En attente' : email.status}
                      </div>
                    </div>
                    
                    {email.body && (
                      <div className="bg-muted/30 rounded-lg p-3 mt-3">
                        <h5 className="text-xs font-medium mb-2 text-muted-foreground">Contenu de l'email:</h5>
                        <div className="text-sm whitespace-pre-wrap">
                          {email.body}
                        </div>
                      </div>
                    )}
                    
                    {email.error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                        <h5 className="text-xs font-medium mb-2 text-red-800">Erreur:</h5>
                        <div className="text-sm text-red-700">
                          {email.error}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadHistory;
