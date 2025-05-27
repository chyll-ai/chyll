
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import LeadStatusBadge from './LeadStatusBadge';
import LeadStatusSelector from './LeadStatusSelector';
import LeadActionsMenu from './LeadActionsMenu';
import LeadFilterBar from './LeadFilterBar';
import { TrendingUp, Mail, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';

interface LeadsTableProps {
  userId: string;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ userId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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
              <table className="w-full table-fixed">
                <thead className="sticky top-0 bg-muted/30 z-10">
                  <tr className="border-b border-border/40">
                    <th className="text-left p-1 font-medium text-xs w-[14%]">Nom</th>
                    <th className="text-left p-1 font-medium text-xs w-[18%]">Email</th>
                    <th className="text-left p-1 font-medium text-xs w-[10%]">Téléphone</th>
                    <th className="text-left p-1 font-medium text-xs w-[13%]">Poste</th>
                    <th className="text-left p-1 font-medium text-xs w-[12%]">Entreprise</th>
                    <th className="text-left p-1 font-medium text-xs w-[8%]">Lieu</th>
                    <th className="text-left p-1 font-medium text-xs w-[6%]">Date</th>
                    <th className="text-left p-1 font-medium text-xs w-[10%]">Statut</th>
                    <th className="text-left p-1 font-medium text-xs w-[9%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <tr 
                      key={lead.id} 
                      className={`border-b border-border/20 hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      }`}
                    >
                      <td className="p-1">
                        <div className="text-xs font-medium truncate" title={lead.full_name}>
                          {lead.full_name || 'N/A'}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="text-xs text-blue-600 truncate" title={lead.email}>
                          {lead.email || 'N/A'}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="text-xs text-muted-foreground truncate" title={lead.phone_number}>
                          {lead.phone_number ? lead.phone_number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3.$4.$5') : 'N/A'}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="text-xs truncate" title={lead.job_title}>
                          {lead.job_title || 'N/A'}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="text-xs font-medium truncate" title={lead.company}>
                          {lead.company || 'N/A'}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="text-xs text-muted-foreground truncate" title={lead.location}>
                          {lead.location || 'N/A'}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString('fr-FR', { 
                            day: '2-digit', 
                            month: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="text-xs">
                          <LeadStatusBadge status={lead.status} />
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="flex gap-1">
                          {lead.email && (
                            <button
                              onClick={() => window.open(`mailto:${lead.email}`)}
                              className="text-xs bg-blue-500/10 text-blue-600 px-1 py-0.5 rounded hover:bg-blue-500/20"
                              title="Envoyer email"
                            >
                              @
                            </button>
                          )}
                          {lead.linkedin_url && (
                            <button
                              onClick={() => window.open(lead.linkedin_url, '_blank')}
                              className="text-xs bg-blue-600/10 text-blue-700 px-1 py-0.5 rounded hover:bg-blue-600/20"
                              title="Voir LinkedIn"
                            >
                              Li
                            </button>
                          )}
                        </div>
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
