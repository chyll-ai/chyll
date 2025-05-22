
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
          .order('full_name', { ascending: true });
          
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
                  
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.full_name || 'N/A'}</TableCell>
                    <TableCell>{lead.job_title || 'N/A'}</TableCell>
                    <TableCell>{lead.email || 'N/A'}</TableCell>
                    <TableCell>{lead.company || 'N/A'}</TableCell>
                    <TableCell>
                      {emailJob ? (
                        <div className={`px-2 py-1 rounded-full text-xs inline-block
                          ${emailJob.status === 'sent' ? 'bg-green-100 text-green-800' : 
                            emailJob.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            emailJob.status === 'failed' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {emailJob.status === 'sent' ? 'Envoyé' : 
                           emailJob.status === 'pending' ? 'En attente' : 
                           emailJob.status === 'failed' ? 'Échec' : 
                           'Non envoyé'}
                        </div>
                      ) : (
                        'Non contacté'
                      )}
                    </TableCell>
                    <TableCell>
                      {emailJob && emailJob.sent_at ? 
                        new Date(emailJob.sent_at).toLocaleDateString('fr-FR', {
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'
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
                        
                        {emailJob && emailJob.status === 'sent' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFollowupLead(lead.id)}
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Relancer
                          </Button>
                        )}
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
