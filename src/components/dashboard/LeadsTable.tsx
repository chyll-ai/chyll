import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import LeadStatusBadge from './LeadStatusBadge';
import LeadStatusSelector from './LeadStatusSelector';
import LeadActionsMenu from './LeadActionsMenu';
import LeadFilterBar from './LeadFilterBar';
import { TrendingUp, Mail, Calendar, CheckSquare, Square, Eye, RefreshCw, AlertCircle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  // Debug logging function
  const log = useCallback((message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage, data || '');
    setDebugInfo(prev => prev + '\n' + logMessage + (data ? ` ${JSON.stringify(data)}` : ''));
  }, []);

  // Test database connection
  const testConnection = useCallback(async () => {
    try {
      log('Testing Supabase connection...');
      const { data, error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
      if (error) {
        log('Connection test failed', error);
        return false;
      }
      log('Connection test successful', { count: data });
      return true;
    } catch (error) {
      log('Connection test error', error);
      return false;
    }
  }, [log]);

  // Fetch leads with timeout and comprehensive error handling
  const fetchLeads = useCallback(async (timeoutMs = 10000) => {
    if (!userId) {
      log('No userId provided, skipping fetch');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      log('Starting leads fetch', { userId, timeout: timeoutMs });

      // Clear any existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Database connection failed');
      }

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        fetchTimeoutRef.current = setTimeout(() => {
          reject(new Error(`Query timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      // Create the query promise
      const queryPromise = supabase
        .from('leads')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      log('Executing query with timeout...');
      
      // Race between query and timeout
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      // Clear timeout if query completed
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }

      log('Query completed', { hasData: !!data, hasError: !!error, dataLength: data?.length });

      if (error) {
        log('Query error', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      const leadsData = data || [];
      log('Successfully fetched leads', { count: leadsData.length });
      
      setLeads(leadsData);
      setError(null);
      
      if (leadsData.length > 0) {
        toast.success(`Loaded ${leadsData.length} leads`);
      } else {
        log('No leads found for user');
      }

    } catch (error: any) {
      log('Fetch leads error', error);
      
      // Clear timeout on error
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }

      const errorMessage = error.message || 'Unknown error occurred';
      setError(errorMessage);
      setLeads([]);
      toast.error(`Failed to fetch leads: ${errorMessage}`);
    } finally {
      log('Setting loading to false');
      setIsLoading(false);
    }
  }, [userId, log, testConnection]);

  // Force stop loading
  const forceStopLoading = useCallback(() => {
    log('Force stopping loading state');
    setIsLoading(false);
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    toast.info('Loading stopped manually');
  }, [log]);

  // Manual refresh with loading state
  const manualRefresh = useCallback(() => {
    log('Manual refresh triggered');
    fetchLeads(15000); // 15 second timeout for manual refresh
  }, [fetchLeads, log]);

  // Initial fetch
  useEffect(() => {
    if (userId && !hasInitializedRef.current) {
      log('Initial fetch starting', { userId });
      hasInitializedRef.current = true;
      fetchLeads();
    } else if (!userId) {
      log('No userId, setting loading to false');
      setIsLoading(false);
    }
  }, [userId, fetchLeads, log]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    log('Setting up real-time subscription', { userId });

    const channel = supabase
      .channel('leads_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `client_id=eq.${userId}`
        },
        (payload) => {
          log('Real-time INSERT received', payload.new);
          const newLead = payload.new as Lead;
          setLeads(currentLeads => {
            const exists = currentLeads.some(lead => lead.id === newLead.id);
            if (exists) {
              log('Lead already exists, skipping duplicate');
              return currentLeads;
            }
            log('Adding new lead to state');
            toast.success(`Nouveau lead ajouté: ${newLead.full_name}`);
            return [newLead, ...currentLeads];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: `client_id=eq.${userId}`
        },
        (payload) => {
          log('Real-time UPDATE received', payload.new);
          const updatedLead = payload.new as Lead;
          setLeads(currentLeads =>
            currentLeads.map(lead =>
              lead.id === updatedLead.id ? updatedLead : lead
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'leads',
          filter: `client_id=eq.${userId}`
        },
        (payload) => {
          log('Real-time DELETE received', payload.old);
          const deletedLead = payload.old as Lead;
          setLeads(currentLeads =>
            currentLeads.filter(lead => lead.id !== deletedLead.id)
          );
        }
      )
      .subscribe((status) => {
        log('Real-time subscription status', status);
      });

    return () => {
      log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, log]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

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

  log('Render state', { 
    isLoading, 
    leadsCount: leads.length, 
    filteredCount: filteredLeads.length,
    hasError: !!error,
    userId 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
          <p className="text-xs text-muted-foreground">Loading leads...</p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={forceStopLoading}
              className="text-xs"
            >
              Stop Loading
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={manualRefresh}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
          {debugInfo && (
            <details className="text-xs text-left bg-muted p-2 rounded max-h-32 overflow-auto">
              <summary>Debug Info</summary>
              <pre className="whitespace-pre-wrap">{debugInfo}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 w-full min-w-0">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mx-auto mb-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-sm font-semibold mb-2 text-red-800">Error Loading Leads</h3>
          <p className="text-xs text-red-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={manualRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
            >
              Test Connection
            </Button>
          </div>
          {debugInfo && (
            <details className="text-xs text-left bg-white p-2 rounded mt-4 max-h-32 overflow-auto">
              <summary>Debug Info</summary>
              <pre className="whitespace-pre-wrap">{debugInfo}</pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 h-full flex flex-col w-full min-w-0">
      {/* Debug Panel */}
      {debugInfo && (
        <Card className="border-blue-200 bg-blue-50 w-full min-w-0">
          <CardContent className="p-2">
            <details className="text-xs">
              <summary className="cursor-pointer text-blue-700 font-medium">
                Debug Info ({leads.length} leads loaded)
              </summary>
              <pre className="whitespace-pre-wrap mt-2 max-h-24 overflow-auto text-blue-600">
                {debugInfo}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}

      {/* Compact Stats Cards */}
      {leads.length > 0 && (
        <div className="grid grid-cols-3 gap-2 w-full min-w-0">
          <Card className="border-border/40 min-w-0">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-blue-500/10 rounded">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold">{leads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 min-w-0">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500/10 rounded">
                  <Mail className="h-3 w-3 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-bold">{leads.filter(l => l.email).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 min-w-0">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-purple-500/10 rounded">
                  <Calendar className="h-3 w-3 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Semaine</p>
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

      <div className="w-full min-w-0">
        <LeadFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          statusOptions={statusOptions}
        />
      </div>

      {/* Manual Controls */}
      <div className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={manualRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={testConnection}
        >
          Test DB
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <Card className="border-border/40 w-full min-w-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedLeads.size} leads sélectionnés
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkStatusUpdate('email envoyé')}
                >
                  Marquer comme contactés
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkStatusUpdate('à relancer')}
                >
                  À relancer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLeads(new Set())}
                >
                  Désélectionner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex-1 overflow-hidden w-full min-w-0">
        {filteredLeads.length === 0 ? (
          <Card className="border-border/40 h-full w-full min-w-0">
            <CardContent className="text-center p-6 flex flex-col items-center justify-center h-full">
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full mx-auto mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2">
                {leads.length === 0 ? 'Aucun lead trouvé' : 'Aucun lead ne correspond aux filtres'}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {leads.length === 0 
                  ? 'Commencez par demander à l\'assistant IA de trouver des leads' 
                  : 'Essayez d\'ajuster vos critères de recherche'
                }
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={manualRefresh}
              >
                Actualiser
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/40 h-full flex flex-col w-full min-w-0">
            <div className="flex-1 overflow-auto w-full min-w-0">
              <div className="w-full min-w-max">
                <table className="w-full table-auto border-collapse min-w-max">
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
                      <th className="text-left p-2 font-medium text-xs min-w-[120px]">Nom</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[180px]">Email</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[120px]">Téléphone</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[140px]">Poste</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[140px]">Entreprise</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[120px]">Lieu</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[80px]">Date</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[140px]">Statut</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[80px]">Voir le lead</th>
                      <th className="text-left p-2 font-medium text-xs min-w-[400px]">Actions</th>
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
                            {lead.phone_number ? lead.phone_number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3.$4.$5') : 'N/A'}
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
                        <td className="p-2 min-w-[140px]">
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
                        <td className="p-2 min-w-[400px]">
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
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;
