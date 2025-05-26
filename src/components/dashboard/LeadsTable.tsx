
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
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {leads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{leads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">With Email</p>
                  <p className="text-2xl font-bold">{leads.filter(l => l.email).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">
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
      
      {filteredLeads.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="text-center p-12">
            <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {leads.length === 0 ? 'No leads found' : 'No leads match your filters'}
            </h3>
            <p className="text-muted-foreground">
              {leads.length === 0 
                ? 'Start by asking the AI assistant to find leads for you' 
                : 'Try adjusting your search criteria or filters'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left p-4 font-medium text-sm">Name</th>
                  <th className="text-left p-4 font-medium text-sm">Company</th>
                  <th className="text-left p-4 font-medium text-sm">Title</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Contact</th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
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
                    <td className="p-4">
                      <div className="font-medium">{lead.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{lead.company}</td>
                    <td className="p-4 text-sm">{lead.job_title}</td>
                    <td className="p-4">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {lead.email && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`mailto:${lead.email}`)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {lead.phone_number && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`tel:${lead.phone_number}`)}
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {lead.linkedin_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(lead.linkedin_url, '_blank')}
                          className="h-8 text-xs"
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
  );
};

export default LeadsTable;
