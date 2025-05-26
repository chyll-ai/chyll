
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import { Button } from '@/components/ui/button';
import LeadStatusBadge from './LeadStatusBadge';
import LeadFilterBar from './LeadFilterBar';
import { ExternalLink, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
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
    <div className="space-y-4 h-full flex flex-col">
      {/* Compact Stats Cards */}
      {leads.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border/40">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500/10 rounded">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{leads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-green-500/10 rounded">
                  <Mail className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-lg font-bold">{leads.filter(l => l.email).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-purple-500/10 rounded">
                  <Calendar className="h-3 w-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Week</p>
                  <p className="text-lg font-bold">
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
            <CardContent className="text-center p-8 flex flex-col items-center justify-center h-full">
              <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2">
                {leads.length === 0 ? 'No leads found' : 'No leads match your filters'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {leads.length === 0 
                  ? 'Start by asking the AI assistant to find leads for you' 
                  : 'Try adjusting your search criteria or filters'
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
                    <th className="text-left p-3 font-medium text-xs">Name</th>
                    <th className="text-left p-3 font-medium text-xs">Company</th>
                    <th className="text-left p-3 font-medium text-xs">Title</th>
                    <th className="text-left p-3 font-medium text-xs">Status</th>
                    <th className="text-left p-3 font-medium text-xs">Contact</th>
                    <th className="text-left p-3 font-medium text-xs">Actions</th>
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
                      <td className="p-3">
                        <div className="text-sm font-medium">{lead.full_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3 text-xs">{lead.company}</td>
                      <td className="p-3 text-xs">{lead.job_title}</td>
                      <td className="p-3">
                        <LeadStatusBadge status={lead.status} />
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {lead.email && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`mailto:${lead.email}`)}
                              className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                          )}
                          {lead.phone_number && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`tel:${lead.phone_number}`)}
                              className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {lead.linkedin_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(lead.linkedin_url, '_blank')}
                            className="h-6 text-xs px-2"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            LinkedIn
                          </Button>
                        )}
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
