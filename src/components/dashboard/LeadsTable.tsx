
import React, { useState, useEffect, useMemo } from 'react';
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
import { Eye, ArrowRight, Tags } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LeadStatusBadge from './LeadStatusBadge';
import LeadFilterBar from './LeadFilterBar';

interface LeadsTableProps {
  userId: string;
}

interface Lead {
  id: string;
  full_name: string;
  job_title: string;
  email: string;
  company: string;
  status: string;
  created_at: string;
  email_jobs?: {
    status: string;
    sent_at: string;
    subject: string;
    body: string;
  }[];
}

const LEAD_STATUS_OPTIONS = [
  'à contacter',
  'email envoyé',
  'répondu',
  'à relancer',
  'appel prévu',
  'RDV',
  'RDV manqué'
];

const LeadsTable: React.FC<LeadsTableProps> = ({ userId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
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
            status,
            created_at,
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
        
        // Set default status for leads without status
        const leadsWithStatus = data?.map(lead => ({
          ...lead,
          status: lead.status || 'à contacter'
        })) || [];
        
        setLeads(leadsWithStatus);
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
  
  const handleUpdateStatus = (lead: Lead) => {
    setCurrentLead(lead);
    setStatusUpdateDialogOpen(true);
  };
  
  const saveLeadStatus = async (newStatus: string) => {
    if (!currentLead) return;
    
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', currentLead.id);
        
      if (error) throw error;
      
      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === currentLead.id ? { ...lead, status: newStatus } : lead
        )
      );
      
      toast.success('Statut mis à jour avec succès');
      setStatusUpdateDialogOpen(false);
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
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

  // Filter leads based on search query and selected statuses
  const filteredLeads = useMemo(() => {
    if (!searchQuery && selectedStatuses.length === 0) return leads;
    
    return leads.filter(lead => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        (lead.full_name && lead.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.job_title && lead.job_title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by selected statuses
      const matchesStatus = selectedStatuses.length === 0 || 
        (lead.status && selectedStatuses.includes(lead.status));
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, selectedStatuses]);
  
  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }
  
  return (
    <>
      <LeadFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        statusOptions={LEAD_STATUS_OPTIONS}
      />
      
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date ajout</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {leads.length === 0 
                    ? 'Aucun lead trouvé. Demandez à l\'assistant de lancer une recherche.' 
                    : 'Aucun résultat correspondant à vos critères de recherche.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => {
                const emailJob = lead.email_jobs && lead.email_jobs.length > 0 
                  ? lead.email_jobs[0] 
                  : null;
                  
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
                      <LeadStatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell>
                      {formatDate(lead.created_at)}
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
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFollowupLead(lead.id)}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Relancer
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(lead)}
                        >
                          <Tags className="h-4 w-4 mr-1" />
                          Statut
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Email Dialog */}
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
      
      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialogOpen} onOpenChange={setStatusUpdateDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mettre à jour le statut</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select 
              defaultValue={currentLead?.status} 
              onValueChange={saveLeadStatus}
              disabled={updatingStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUS_OPTIONS.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsTable;
