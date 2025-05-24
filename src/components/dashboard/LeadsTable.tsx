import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, ArrowRight, Tags, Mail, Phone, Calendar, FileText, RefreshCw } from 'lucide-react';
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
  status: string | null;
  created_at: string;
  email_jobs?: {
    status: string;
    sent_at: string;
    subject: string;
    body: string;
  }[];
}

interface SearchLeadsResponse {
  message: string;
  total: number;
  leads: Lead[];
}

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label, variant = "outline" }) => (
  <Button
    variant={variant}
    size="sm"
    onClick={onClick}
    className="whitespace-nowrap"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Button>
);

const LEAD_STATUS_OPTIONS = [
  'new',
  'à contacter',
  'email envoyé',
  'répondu',
  'à relancer',
  'appel prévu',
  'RDV',
  'RDV manqué'
];

const normalizeStatus = (status: string): string => {
  if (!status) return 'new';
  
  const normalized = status.toLowerCase().trim();
  
  // Direct match for 'new'
  if (normalized === 'new') return 'new';
  
  // Check for exact matches first
  const exactMatch = LEAD_STATUS_OPTIONS.find(s => s.toLowerCase() === normalized);
  if (exactMatch) return exactMatch;
  
  // Then check for partial matches
  const partialMatch = LEAD_STATUS_OPTIONS.find(s => 
    normalized.includes(s.toLowerCase()) || 
    s.toLowerCase().includes(normalized)
  );
  if (partialMatch) return partialMatch;
  
  // If no match found, return 'new'
  return 'new';
};

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
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitialFetchRef = useRef(true);
  const unmountingRef = useRef(false);

  const fetchLeads = async () => {
    try {
      console.log('Fetching leads for user:', userId);
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
      isInitialFetchRef.current = false;
    }
  };
  
  useEffect(() => {
    // Initial fetch
    fetchLeads();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    unmountingRef.current = false;

    const setupSubscription = () => {
      if (unmountingRef.current) {
        return;
      }

      const channelId = `realtime:public:leads:client_id=eq.${userId}`;
      
      const channel = supabase.channel(channelId)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'leads',
          filter: `client_id=eq.${userId}`
        }, async (payload: any) => {
          if (unmountingRef.current) return;
            
          try {
            if (payload.eventType === 'INSERT') {
              setLeads(currentLeads => {
                if (currentLeads.some(lead => lead.id === payload.new.id)) {
                  return currentLeads;
                }
                return [{ ...payload.new, status: payload.new.status || 'à contacter' }, ...currentLeads];
              });
            } else if (payload.eventType === 'UPDATE') {
              setLeads(currentLeads => 
                currentLeads.map(lead => {
                  if (lead.id === payload.new.id) {
                    // Only update if there are actual changes
                    const hasChanges = 
                      lead.status !== payload.new.status ||
                      lead.full_name !== payload.new.full_name ||
                      lead.job_title !== payload.new.job_title ||
                      lead.email !== payload.new.email ||
                      lead.company !== payload.new.company;

                    if (hasChanges) {
                      return {
                        ...lead,
                        status: payload.new.status || lead.status || 'à contacter',
                        full_name: payload.new.full_name || lead.full_name,
                        job_title: payload.new.job_title || lead.job_title,
                        email: payload.new.email || lead.email,
                        company: payload.new.company || lead.company,
                        created_at: payload.new.created_at || lead.created_at,
                        email_jobs: lead.email_jobs || []
                      };
                    }
                  }
                  return lead;
                })
              );
            } else if (payload.eventType === 'DELETE') {
              setLeads(currentLeads => 
                currentLeads.filter(lead => lead.id !== payload.old.id)
              );
            }
          } catch (error) {
            console.error('Error processing real-time update:', error);
          }
        });

      channel.subscribe((status, err) => {
        if (unmountingRef.current) return;
        
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error:', err);
          toast.error('Erreur de connexion temps réel - Actualisez la page');
        }
      });

      channelRef.current = channel;
      return channel;
    };

    const channel = setupSubscription();

    return () => {
      unmountingRef.current = true;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [userId]);

  const handleViewMessage = (subject: string, body: string) => {
    setSelectedEmail({ subject, body });
    setEmailDialogOpen(true);
  };
  
  const handleChatAction = async (leadId: string | null, action: string, status?: string, leadName?: string, notes?: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const access_token = session?.session?.access_token;
      const client_id = session?.session?.user?.id;
      
      if (!access_token || !client_id) {
        toast.error('Vous devez être connecté pour effectuer cette action');
        return;
      }

      // For status updates, only update if the status is actually different
      if (action === 'update_status' && status && leadId) {
        const lead = leads.find(l => l.id === leadId);
        if (lead && lead.status !== status) {
          setLeads(prevLeads => 
            prevLeads.map(l => 
              l.id === leadId ? { ...l, status } : l
            )
          );
        }
      }
      
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co';
        const response = await fetch(`${baseUrl}/functions/v1/chat-action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
            'x-client-info': '@supabase/auth-helpers-nextjs@0.7.4'
          },
          credentials: 'include',
          body: JSON.stringify({
            lead_id: leadId,
            lead_name: leadName,
            action,
            status,
            notes,
            user_id: client_id
          })
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({ error: 'Failed to parse response' }));
          if (response.status === 300 && result.leads) {
            toast.error(`Plusieurs leads trouvés avec ce nom. Veuillez être plus précis.`);
            return result.leads;
          }
          throw new Error(result.error || `Error: ${response.status}`);
        }

        const result = await response.json();
        toast.success(result.message || 'Action effectuée avec succès');
        return result.lead;

      } catch (fetchError: any) {
        // Handle network errors (including CORS)
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          console.error('Network error (possibly CORS):', fetchError);
          toast.error('Erreur de connexion au serveur. Veuillez réessayer.');
        } else {
          console.error('Error executing chat action:', fetchError);
          toast.error(fetchError.message || 'Erreur lors de l\'exécution de l\'action');
        }
        
        // If it was a status update that failed, revert the local state
        if (action === 'update_status' && status && leadId) {
          const originalLead = leads.find(l => l.id === leadId);
          if (originalLead) {
            setLeads(prevLeads => 
              prevLeads.map(l => 
                l.id === leadId ? { ...l, status: originalLead.status } : l
              )
            );
          }
        }
        return null;
      }

    } catch (error) {
      console.error('Error in handleChatAction:', error);
      toast.error('Une erreur inattendue est survenue');
      return null;
    }
  };

  const handleSendColdEmail = async (leadId: string) => {
    await handleChatAction(leadId, 'send_cold_email');
  };

  const handleFollowupLead = async (leadId: string) => {
    await handleChatAction(leadId, 'send_followup');
  };

  const handleUpdateStatus = (lead: Lead) => {
    setCurrentLead(lead);
    setStatusUpdateDialogOpen(true);
  };
  
  const saveLeadStatus = async (newStatus: string) => {
    if (!currentLead) return;
    
    try {
      const { data: session } = await supabase.auth.getSession();
      const access_token = session?.session?.access_token;
      const client_id = session?.session?.user?.id;
      
      if (!access_token || !client_id) {
        toast.error('Vous devez être connecté pour effectuer cette action');
        return;
      }

      setUpdatingStatus(true);
      
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co';
      const response = await fetch(`${baseUrl}/functions/v1/update-lead-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'x-client-info': '@supabase/auth-helpers-nextjs@0.7.4'
        },
        credentials: 'include',
        body: JSON.stringify({
          lead_id: currentLead.id,
          status: newStatus,
          user_id: client_id
        })
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Failed to parse response' }));
        throw new Error(result.error || `Error: ${response.status}`);
      }

      const result = await response.json();
      toast.success(result.message || 'Statut mis à jour avec succès');
      
      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(l => 
          l.id === currentLead.id ? { ...l, status: newStatus } : l
        )
      );
      
      setStatusUpdateDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du statut');
      
      // Revert local state if there was an error
      setLeads(prevLeads => 
        prevLeads.map(l => 
          l.id === currentLead.id ? { ...l, status: currentLead.status } : l
        )
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleScheduleCall = async (leadId: string) => {
    await handleChatAction(leadId, 'schedule_call');
  };

  // New function to find a lead by name
  const findLeadByName = async (name: string) => {
    return await handleChatAction(null, 'find_lead', undefined, name);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    // Format the time part
    const timeStr = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Yesterday's date at midnight
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today) {
      // Today
      if (diffMinutes < 1) {
        return `À l'instant - ${timeStr}`;
      } else if (diffMinutes < 60) {
        return `Il y a ${diffMinutes} min - ${timeStr}`;
      } else {
        return `Aujourd'hui - ${timeStr}`;
      }
    } else if (date >= yesterday) {
      // Yesterday
      return `Hier - ${timeStr}`;
    } else {
      // Older dates
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Filter leads based on search query and selected statuses
  const filteredLeads = useMemo(() => {
    if (!searchQuery && selectedStatuses.length === 0) return leads;
    
    return leads.filter(lead => {
      const matchesSearch = searchQuery === '' || 
        (lead.full_name && lead.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.job_title && lead.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = selectedStatuses.length === 0 || 
        (lead.status && selectedStatuses.includes(lead.status));
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, selectedStatuses]);
  
  const getLeadActions = (lead: Lead) => {
    const hasEmailJobs = lead.email_jobs && lead.email_jobs.length > 0;
    const rawStatus = lead.status || 'new';
    const status = normalizeStatus(rawStatus);

    const actions = [];

    // View message button (if there are email jobs)
    if (hasEmailJobs && lead.email_jobs![0].subject && lead.email_jobs![0].body) {
      actions.push(
        <ActionButton
          key="view"
          onClick={() => handleViewMessage(lead.email_jobs![0].subject, lead.email_jobs![0].body)}
          icon={<Eye className="h-4 w-4" />}
          label="Voir message"
        />
      );
    }

    // Status-based actions
    switch (status.toLowerCase()) {
      case 'new':
      case 'à contacter':
        actions.push(
          <ActionButton
            key="cold-email"
            onClick={() => handleSendColdEmail(lead.id)}
            icon={<Mail className="h-4 w-4" />}
            label="Envoyer email initial"
            variant="default"
          />
        );
        break;

      case 'email envoyé':
        actions.push(
          <ActionButton
            key="followup"
            onClick={() => handleFollowupLead(lead.id)}
            icon={<ArrowRight className="h-4 w-4" />}
            label="Relancer"
          />
        );
        break;

      case 'répondu':
        actions.push(
          <ActionButton
            key="schedule"
            onClick={() => handleScheduleCall(lead.id)}
            icon={<Phone className="h-4 w-4" />}
            label="Planifier appel"
            variant="secondary"
          />
        );
        break;

      case 'à relancer':
        actions.push(
          <ActionButton
            key="followup-urgent"
            onClick={() => handleFollowupLead(lead.id)}
            icon={<ArrowRight className="h-4 w-4" />}
            label="Relancer"
            variant="destructive"
          />
        );
        break;

      case 'appel prévu':
        actions.push(
          <ActionButton
            key="call-reminder"
            onClick={() => handleViewCallDetails(lead.id)}
            icon={<Calendar className="h-4 w-4" />}
            label="Voir RDV"
          />
        );
        break;

      case 'rdv':
        actions.push(
          <ActionButton
            key="meeting-notes"
            onClick={() => handleAddMeetingNotes(lead.id)}
            icon={<FileText className="h-4 w-4" />}
            label="Notes RDV"
          />
        );
        break;

      case 'rdv manqué':
        actions.push(
          <ActionButton
            key="reschedule"
            onClick={() => handleRescheduleCall(lead.id)}
            icon={<RefreshCw className="h-4 w-4" />}
            label="Replanifier"
            variant="secondary"
          />
        );
        break;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {actions}
      </div>
    );
  };

  const handleViewCallDetails = async (leadId: string) => {
    // Implement call details viewing logic
    toast.info('Fonctionnalité à venir');
  };

  const handleAddMeetingNotes = async (leadId: string) => {
    // Implement meeting notes logic
    toast.info('Fonctionnalité à venir');
  };

  const handleRescheduleCall = async (leadId: string) => {
    // Implement call rescheduling logic
    toast.info('Fonctionnalité à venir');
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }
  
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Rechercher par nom, entreprise, titre ou email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        <LeadFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          statusOptions={LEAD_STATUS_OPTIONS}
        />
      </div>
      
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Date ajout</TableHead>
              <TableHead>Statut</TableHead>
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
                      {formatDate(lead.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LeadStatusBadge status={lead.status || 'à contacter'} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(lead)}
                          className="ml-2"
                        >
                          <Tags className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getLeadActions(lead)}
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
            <DialogDescription>
              Choisissez un nouveau statut pour {currentLead?.full_name || 'ce lead'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select 
              defaultValue={currentLead?.status || undefined} 
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
