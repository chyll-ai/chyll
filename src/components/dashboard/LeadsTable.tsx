
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface LeadsTableProps {
  userId: string;
}

interface Lead {
  id: string;
  full_name: string;
  job_title: string;
  email: string;
  company: string;
  email_jobs?: {
    status: string;
    sent_at: string;
    subject: string;
    body: string;
  }[];
}

const LeadsTable: React.FC<LeadsTableProps> = ({ userId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<{ subject: string; body: string } | null>(null);
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Fetch leads with their associated email jobs
        const { data, error } = await supabase
          .from('leads')
          .select(`
            id,
            full_name,
            job_title,
            email,
            company,
            email_jobs (
              status,
              sent_at,
              subject,
              body
            )
          `)
          .eq('client_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setLeads(data || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast.error('Erreur lors du chargement des leads');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, [userId]);
  
  const handleViewMessage = (subject: string, body: string) => {
    setSelectedEmail({ subject, body });
    setEmailDialogOpen(true);
  };
  
  const handleFollowupLead = async (leadId: string) => {
    try {
      // Get current user token
      const { data } = await supabase.auth.getSession();
      const access_token = data.session?.access_token;
      const client_id = data.session?.user?.id;
      
      if (!access_token || !client_id) {
        toast.error('Vous devez être connecté pour effectuer cette action');
        return;
      }
      
      toast.info('Envoi du message de relance en cours...');
      
      // Call handle function directly with a tool call object
      await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/send-followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          lead_id: leadId,
          user_id: client_id
        })
      });
      
      toast.success('Message de relance envoyé avec succès');
    } catch (error) {
      console.error('Error sending followup:', error);
      toast.error('Erreur lors de l\'envoi de la relance');
    }
  };
  
  const getStatusDisplay = (lead: Lead) => {
    const emailJob = lead.email_jobs && lead.email_jobs.length > 0 ? lead.email_jobs[0] : null;
    
    if (!emailJob) {
      return { 
        text: 'Non envoyé',
        className: 'bg-gray-100 text-gray-800'
      };
    }
    
    if (emailJob.status === 'failed') {
      return { 
        text: 'Échec', 
        className: 'bg-red-100 text-red-800'
      };
    }
    
    if (emailJob.status === 'sent') {
      // Check if sent more than 3 days ago
      const sentDate = new Date(emailJob.sent_at);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      if (sentDate < threeDaysAgo) {
        return { 
          text: 'À relancer', 
          className: 'bg-amber-100 text-amber-800'
        };
      }
      
      return { 
        text: 'Envoyé', 
        className: 'bg-green-100 text-green-800'
      };
    }
    
    return { 
      text: emailJob.status === 'pending' ? 'En attente' : 'Non envoyé', 
      className: emailJob.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
    };
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
      }
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };
  
  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'envoi</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun lead trouvé. Demandez à l'assistant de lancer une recherche.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => {
                const emailJob = lead.email_jobs && lead.email_jobs.length > 0 
                  ? lead.email_jobs[0] 
                  : null;
                  
                const status = getStatusDisplay(lead);
                  
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.full_name || 'N/A'}</TableCell>
                    <TableCell>{lead.job_title || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{lead.email || 'N/A'}</span>
                        {lead.email && (
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(lead.email);
                              toast.success('Email copié !');
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{lead.company || 'N/A'}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-xs inline-block ${status.className}`}>
                        {status.text}
                      </div>
                    </TableCell>
                    <TableCell>
                      {emailJob && emailJob.sent_at ? 
                        formatDate(emailJob.sent_at) : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {emailJob && emailJob.subject && emailJob.body && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMessage(emailJob.subject, emailJob.body)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir message
                          </Button>
                        )}
                        
                        {status.text === 'À relancer' || status.text === 'Envoyé' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFollowupLead(lead.id)}
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Relancer
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject || 'Message'}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="max-h-[60vh] overflow-auto whitespace-pre-wrap">
            {selectedEmail?.body}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsTable;
