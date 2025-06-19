
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
import { Lead } from '@/types/assistant';

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
    <Card className="w-full">
      <CardHeader className="pb-3">
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
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="min-w-[140px]">Nom</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[120px]">Téléphone</TableHead>
                <TableHead className="min-w-[150px]">Société</TableHead>
                <TableHead className="min-w-[130px]">Poste</TableHead>
                <TableHead className="min-w-[120px]">Localisation</TableHead>
                <TableHead className="min-w-[140px]">Statut</TableHead>
                <TableHead className="min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : displayLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
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
                      <div className="truncate max-w-[140px]" title={lead.full_name || 'N/A'}>
                        {lead.full_name || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.email ? (
                        <a 
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 hover:underline truncate block max-w-[200px]"
                          title={lead.email}
                        >
                          {lead.email}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate max-w-[120px]" title={lead.phone_number || 'N/A'}>
                        {lead.phone_number || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate max-w-[150px]" title={lead.company || 'N/A'}>
                        {lead.company || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate max-w-[130px]" title={lead.job_title || 'N/A'}>
                        {lead.job_title || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="truncate max-w-[120px]" title={lead.location || 'N/A'}>
                        {lead.location || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <LeadStatusSelector 
                        lead={lead as Lead} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    </TableCell>
                    <TableCell>
                      <LeadActionsMenu 
                        lead={lead as Lead} 
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
