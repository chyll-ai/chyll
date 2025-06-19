
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  Mail, 
  Zap, 
  Archive
} from 'lucide-react';
import { useAssistantActions } from '@/hooks/useAssistantActions';
import { useApolloEnrichment } from '@/hooks/useApolloEnrichment';
import { useGmailSender } from '@/hooks/useGmailSender';
import LeadStatusSelector from '@/components/dashboard/LeadStatusSelector';
import LeadActionsMenu from '@/components/dashboard/LeadActionsMenu';

interface Lead {
  id: string;
  client_id?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  job_title?: string;
  company?: string;
  location?: string;
  linkedin_url?: string;
  linkedin_profile_data?: any;
  status?: string;
  last_contact_date?: string;
  created_at?: string;
  updated_at?: string;
  enriched_from?: any;
  search_id?: string;
}

const WorkspaceLeadTable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { leads, filteredLeads, loading, assistantActions } = useAssistantActions();
  const { enrichLead, enriching } = useApolloEnrichment();
  const { sendEmail, sending } = useGmailSender();

  useEffect(() => {
    assistantActions.loadLeads();
  }, []);

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleEnrichSelected = async () => {
    if (selectedLeads.length === 0) return;
    await assistantActions.enrichLeadsAction(selectedLeads);
    setSelectedLeads([]);
  };

  const handleSendEmailsSelected = async () => {
    if (selectedLeads.length === 0) return;
    await assistantActions.sendEmailsAction(selectedLeads);
    setSelectedLeads([]);
  };

  const handleArchiveSelected = async () => {
    if (selectedLeads.length === 0) return;
    for (const leadId of selectedLeads) {
      await assistantActions.updateLeadStatus(leadId, 'archived');
    }
    setSelectedLeads([]);
  };

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    // This will be handled by the LeadStatusSelector component internally
    // and the leads will be refreshed through the assistantActions
  };

  const displayLeads = filteredLeads.length > 0 ? filteredLeads : leads;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4 text-primary" />
            Leads ({displayLeads.length})
          </CardTitle>
          
          {selectedLeads.length > 0 && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEnrichSelected}
                disabled={enriching}
                className="text-sm px-3"
              >
                <Zap className="h-4 w-4 mr-2" />
                Enrichir ({selectedLeads.length})
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSendEmailsSelected}
                disabled={sending}
                className="text-sm px-3"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleArchiveSelected}
                className="text-sm px-3"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-40">Nom</TableHead>
                <TableHead className="w-52">Email</TableHead>
                <TableHead className="w-32">Téléphone</TableHead>
                <TableHead className="w-44">Société</TableHead>
                <TableHead className="w-44">Poste</TableHead>
                <TableHead className="w-40">Localisation</TableHead>
                <TableHead className="w-32">Statut</TableHead>
                <TableHead className="w-64">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : displayLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Aucun lead trouvé
                  </TableCell>
                </TableRow>
              ) : (
                displayLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      <div className="truncate" title={lead.full_name || 'N/A'}>
                        {lead.full_name || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.email ? (
                        <a 
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 hover:underline truncate block"
                          title={lead.email}
                        >
                          {lead.email}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate" title={lead.phone_number || 'N/A'}>
                        {lead.phone_number || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate" title={lead.company || 'N/A'}>
                        {lead.company || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate" title={lead.job_title || 'N/A'}>
                        {lead.job_title || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate" title={lead.location || 'N/A'}>
                        {lead.location || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <LeadStatusSelector 
                        lead={lead} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    </TableCell>
                    <TableCell>
                      <LeadActionsMenu 
                        lead={lead} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceLeadTable;
