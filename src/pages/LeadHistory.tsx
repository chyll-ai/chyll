
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Calendar, User, Building2, MapPin, Phone, ExternalLink } from 'lucide-react';
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
