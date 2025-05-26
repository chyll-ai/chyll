
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/assistant';
import { Button } from '@/components/ui/button';
import LeadStatusBadge from './LeadStatusBadge';
import LeadFilterBar from './LeadFilterBar';
import { ExternalLink, Mail, Phone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface LeadsTableProps {
  userId: string;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ userId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    company: 'all'
  });

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
    const matchesStatus = filters.status === 'all' || lead.status === filters.status;
    const matchesSearch = !filters.search || 
      lead.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCompany = filters.company === 'all' || lead.company === filters.company;
    
    return matchesStatus && matchesSearch && matchesCompany;
  });

  const companies = Array.from(new Set(leads.map(lead => lead.company).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LeadFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        companies={companies}
      />
      
      {filteredLeads.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          {leads.length === 0 ? 'No leads found' : 'No leads match your filters'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Contact</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{lead.full_name}</td>
                  <td className="p-3">{lead.company}</td>
                  <td className="p-3">{lead.job_title}</td>
                  <td className="p-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {lead.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`mailto:${lead.email}`)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {lead.phone_number && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`tel:${lead.phone_number}`)}
                        >
                          <Phone className="h-4 w-4" />
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
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
