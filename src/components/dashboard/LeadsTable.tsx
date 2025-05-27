
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import LeadStatusBadge from './LeadStatusBadge';
import LeadStatusSelector from './LeadStatusSelector';
import LeadActionsMenu from './LeadActionsMenu';
import LeadFilterBar from './LeadFilterBar';
import { TrendingUp, Mail, Calendar, CheckSquare, Square } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LeadsTableProps {
  userId: string;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ userId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLeads();
    }
  }, [userId]);

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
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
          <p className="text-xs text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Compact Stats Cards */}
      {leads.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
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

      <LeadFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        statusOptions={statusOptions}
      />

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <Card className="border-border/40">
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
      
      <div className="flex-1 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <Card className="border-border/40 h-full">
            <CardContent className="text-center p-6 flex flex-col items-center justify-center h-full">
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full mx-auto mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2">
                {leads.length === 0 ? 'Aucun lead trouvé' : 'Aucun lead ne correspond aux filtres'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {leads.length === 0 
                  ? 'Commencez par demander à l\'assistant IA de trouver des leads' 
                  : 'Essayez d\'ajuster vos critères de recherche'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/40 h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-muted/30 z-10">
                  <tr className="border-b border-border/40">
                    <th className="text-left p-2 font-medium text-xs w-8">
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
                    <th className="text-left p-2 font-medium text-xs">Nom</th>
                    <th className="text-left p-2 font-medium text-xs">Email</th>
                    <th className="text-left p-2 font-medium text-xs">Téléphone</th>
                    <th className="text-left p-2 font-medium text-xs">Poste</th>
                    <th className="text-left p-2 font-medium text-xs">Entreprise</th>
                    <th className="text-left p-2 font-medium text-xs">Lieu</th>
                    <th className="text-left p-2 font-medium text-xs">Date</th>
                    <th className="text-left p-2 font-medium text-xs">Statut</th>
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
                        <div className="text-xs font-medium" title={lead.full_name}>
                          {lead.full_name || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-blue-600" title={lead.email}>
                          {lead.email || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-muted-foreground" title={lead.phone_number}>
                          {lead.phone_number ? lead.phone_number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3.$4.$5') : 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs" title={lead.job_title}>
                          {lead.job_title || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs font-medium" title={lead.company}>
                          {lead.company || 'N/A'}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-muted-foreground" title={lead.location}>
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
