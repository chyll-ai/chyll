import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import LeadStatusBadge from './LeadStatusBadge';
import LeadStatusSelector from './LeadStatusSelector';
import LeadActionsMenu from './LeadActionsMenu';
import LeadFilterBar from './LeadFilterBar';
import { TrendingUp, Mail, Calendar, CheckSquare, Square, Eye } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LeadsTableProps {
  userId: string;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [clientId, setClientId] = useState<string | null>(null);

  // Get or create client_id from clients table using auth user ID
  const getOrCreateClientId = async () => {
    if (!userId) {
      console.log('LeadsTable: No userId provided');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('LeadsTable: Fetching client_id for auth user:', userId);
      
      // First try to find existing client
      const { data: existingClient, error: selectError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (selectError) {
        console.error('LeadsTable: Error fetching client:', selectError);
        throw selectError;
      }

      if (existingClient) {
        console.log('LeadsTable: Found existing client:', existingClient);
        setClientId(existingClient.id);
        return;
      }

      // If no client exists, we need to get the user's email to create one
      console.log('LeadsTable: No client found, checking auth user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.email) {
        console.error('LeadsTable: Error getting user data:', userError);
        throw new Error('Could not get user email');
      }

      // Create new client record
      console.log('LeadsTable: Creating new client record...');
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert({
          id: userId,
          email: user.email
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('LeadsTable: Error creating client:', insertError);
        throw insertError;
      }

      console.log('LeadsTable: Created new client:', newClient);
      setClientId(newClient.id);
    } catch (error: any) {
      console.error('LeadsTable: Error getting/creating client_id:', error);
      toast.error('Failed to load client data');
      setIsLoading(false);
    }
  };

  // Fetch leads using client_id
  const fetchLeads = async () => {
    if (!clientId) {
      console.log('LeadsTable: No clientId available for fetching leads');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('LeadsTable: Fetching leads for client_id:', clientId);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('LeadsTable: Error fetching leads:', error);
        throw error;
      }
      
      console.log('LeadsTable: Fetched leads:', data);
      setLeads(data || []);
    } catch (error: any) {
      console.error('LeadsTable: Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  // Get client_id when userId changes
  useEffect(() => {
    getOrCreateClientId();
  }, [userId]);

  // Fetch leads when clientId changes
  useEffect(() => {
    if (clientId) {
      fetchLeads();
    }
  }, [clientId]);

  // Real-time subscription using client_id
  useEffect(() => {
    if (!clientId) return;

    console.log('LeadsTable: Setting up realtime for client_id:', clientId);
    const channel = supabase
      .channel('leads_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => {
          console.log('LeadsTable: New lead received:', payload);
          const newLead = payload.new as Lead;
          setLeads(current => [newLead, ...current]);
          toast.success(`New lead: ${newLead.full_name}`);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => {
          console.log('LeadsTable: Lead updated:', payload);
          const updatedLead = payload.new as Lead;
          setLeads(current =>
            current.map(lead =>
              lead.id === updatedLead.id ? updatedLead : lead
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  // If no userId, show auth message
  if (!userId) {
    return (
      <Card className="border-border/40 h-full w-full">
        <CardContent className="text-center p-6 flex flex-col items-center justify-center h-full">
          <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full mx-auto mb-3">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold mb-2">Authentication Required</h3>
          <p className="text-xs text-muted-foreground">Please log in to view your leads</p>
        </CardContent>
      </Card>
    );
  }

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const toggleLeadSelection = (leadId: string) => {
    const newSelection = new Set(selectedLeads);
    if (newSelection.has(leadId)) {
      newSelection.delete(leadId);
    } else {
      newSelection.add(leadId);
    }
    setSelectedLeads(newSelection);
  };

  const selectAllLeads = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id)));
    }
  };

  const bulkStatusUpdate = async (newStatus: string) => {
    try {
      const leadIds = Array.from(selectedLeads);
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .in('id', leadIds);

      if (error) throw error;

      setLeads(prevLeads =>
        prevLeads.map(lead =>
          selectedLeads.has(lead.id) ? { ...lead, status: newStatus } : lead
        )
      );
      
      setSelectedLeads(new Set());
      toast.success(`${leadIds.length} leads updated`);
    } catch (error: any) {
      console.error('Error updating leads:', error);
      toast.error('Failed to update leads');
    }
  };

  const handleViewLead = (leadId: string) => {
    navigate(`/lead-history/${leadId}`);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchQuery || 
      lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(lead.status);
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = Array.from(new Set(leads.map(lead => lead.status).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-3 h-full flex flex-col w-full">
      {/* Stats Cards */}
      {leads.length > 0 && (
        <div className="grid grid-cols-3 gap-2 w-full">
          <Card className="border-border/40">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-blue-500/10 rounded">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold">{leads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500/10 rounded">
                  <Mail className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-bold">{leads.filter(l => l.email).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-purple-500/10 rounded">
                  <Calendar className="h-3 w-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Week</p>
                  <p className="text-sm font-bold">
                    {leads.filter(l => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(l.created_at) > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="w-full">
        <LeadFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          statusOptions={statusOptions}
        />
      </div>

      {selectedLeads.size > 0 && (
        <Card className="border-border/40 w-full">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedLeads.size} leads selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkStatusUpdate('email envoyé')}
                >
                  Mark as Contacted
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkStatusUpdate('à relancer')}
                >
                  Follow Up
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLeads(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex-1 overflow-hidden w-full">
        {filteredLeads.length === 0 ? (
          <Card className="border-border/40 h-full w-full">
            <CardContent className="text-center p-6 flex flex-col items-center justify-center h-full">
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full mx-auto mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2">
                {leads.length === 0 ? 'No leads found' : 'No leads match filters'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {leads.length === 0 
                  ? 'Ask the AI assistant to find leads' 
                  : 'Try adjusting your search criteria'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/40 h-full flex flex-col w-full">
            <div className="flex-1 overflow-auto w-full">
              <table className="w-full table-auto border-collapse">
                <thead className="sticky top-0 bg-muted/30 z-10">
                  <tr className="border-b border-border/40">
                    <th className="text-left p-2 font-medium text-xs w-12">
                      <button
                        onClick={selectAllLeads}
                        className="flex items-center justify-center w-4 h-4"
                      >
                        {selectedLeads.size === filteredLeads.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="text-left p-2 font-medium text-xs">Name</th>
                    <th className="text-left p-2 font-medium text-xs">Email</th>
                    <th className="text-left p-2 font-medium text-xs">Phone</th>
                    <th className="text-left p-2 font-medium text-xs">Job Title</th>
                    <th className="text-left p-2 font-medium text-xs">Company</th>
                    <th className="text-left p-2 font-medium text-xs">Location</th>
                    <th className="text-left p-2 font-medium text-xs">Date</th>
                    <th className="text-left p-2 font-medium text-xs">Status</th>
                    <th className="text-left p-2 font-medium text-xs">View</th>
                    <th className="text-left p-2 font-medium text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <tr 
                      key={lead.id} 
                      className={`border-b border-border/20 hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      } ${selectedLeads.has(lead.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="p-2">
                        <button
                          onClick={() => toggleLeadSelection(lead.id)}
                          className="flex items-center justify-center w-4 h-4"
                        >
                          {selectedLeads.has(lead.id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-2">
                        <div className="text-xs font-medium truncate max-w-32" title={lead.full_name}>
                          {lead.full_name || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-blue-600 truncate max-w-48" title={lead.email}>
                          {lead.email || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-muted-foreground truncate max-w-32" title={lead.phone_number}>
                          {lead.phone_number || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs truncate max-w-40" title={lead.job_title}>
                          {lead.job_title || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs font-medium truncate max-w-40" title={lead.company}>
                          {lead.company || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-muted-foreground truncate max-w-32" title={lead.location}>
                          {lead.location || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString('fr-FR', { 
                            day: '2-digit', 
                            month: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="p-2">
                        <LeadStatusSelector 
                          lead={lead} 
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLead(lead.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="p-2">
                        <LeadActionsMenu 
                          lead={lead} 
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;
