import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Archive,
  ExternalLink
} from 'lucide-react';
import { useAssistantActions } from '@/hooks/useAssistantActions';
import { useApolloEnrichment } from '@/hooks/useApolloEnrichment';
import { useGmailSender } from '@/hooks/useGmailSender';
import { useResponsive } from '@/hooks/use-responsive';

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
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { leads, filteredLeads, loading, assistantActions } = useAssistantActions();
  const { enrichLead, enriching } = useApolloEnrichment();
  const { sendEmail, sending } = useGmailSender();
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    assistantActions.loadLeads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-gray-100 text-gray-800';
      case 'enriching': return 'bg-yellow-100 text-yellow-800';
      case 'enriched': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      case 'responded': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

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

  const displayLeads = filteredLeads.length > 0 ? filteredLeads : leads;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Leads</span> ({displayLeads.length})
          </CardTitle>
          
          {selectedLeads.length > 0 && (
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEnrichSelected}
                disabled={enriching}
                className="text-xs px-2"
              >
                <Zap className="h-3 w-3 mr-1" />
                {!isMobile && `Enrichir (${selectedLeads.length})`}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSendEmailsSelected}
                disabled={sending}
                className="text-xs px-2"
              >
                <Mail className="h-3 w-3 mr-1" />
                {!isMobile && "Email"}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleArchiveSelected}
                className="text-xs px-2"
              >
                <Archive className="h-3 w-3 mr-1" />
                {!isMobile && "Archive"}
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
                <TableHead className="w-8">
                  <Checkbox
                    checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="min-w-[120px]">Nom</TableHead>
                {!isMobile && <TableHead className="min-w-[150px]">Email</TableHead>}
                {!isMobile && !isTablet && <TableHead className="min-w-[100px]">Téléphone</TableHead>}
                <TableHead className="min-w-[100px]">Société</TableHead>
                {!isMobile && <TableHead className="min-w-[100px]">Poste</TableHead>}
                {!isMobile && !isTablet && <TableHead className="min-w-[100px]">Localisation</TableHead>}
                <TableHead className="min-w-[80px]">Statut</TableHead>
                <TableHead className="w-20">Actions</TableHead>
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
                      <div className="truncate max-w-[120px]" title={lead.full_name || 'N/A'}>
                        {lead.full_name || 'N/A'}
                      </div>
                      {isMobile && lead.email && (
                        <div className="text-xs text-muted-foreground truncate">
                          {lead.email}
                        </div>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell className="text-sm">
                        {lead.email ? (
                          <a 
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:underline truncate block max-w-[150px]"
                            title={lead.email}
                          >
                            {lead.email}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    )}
                    {!isMobile && !isTablet && (
                      <TableCell className="text-sm">
                        <div className="truncate max-w-[100px]" title={lead.phone_number || 'N/A'}>
                          {lead.phone_number || 'N/A'}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-sm">
                      <div className="truncate max-w-[100px]" title={lead.company || 'N/A'}>
                        {lead.company || 'N/A'}
                      </div>
                    </TableCell>
                    {!isMobile && (
                      <TableCell className="text-sm">
                        <div className="truncate max-w-[100px]" title={lead.job_title || 'N/A'}>
                          {lead.job_title || 'N/A'}
                        </div>
                      </TableCell>
                    )}
                    {!isMobile && !isTablet && (
                      <TableCell className="text-sm">
                        <div className="truncate max-w-[100px]" title={lead.location || 'N/A'}>
                          {lead.location || 'N/A'}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge className={`${getStatusColor(lead.status || 'new')} text-xs`}>
                        {lead.status || 'new'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => enrichLead(lead.id)}
                          disabled={enriching}
                          className="h-6 w-6 p-0"
                        >
                          <Zap className="h-3 w-3" />
                        </Button>
                        {lead.email && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => sendEmail(lead.email!, 'Contact', 'Bonjour...')}
                            disabled={sending}
                            className="h-6 w-6 p-0"
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                        {lead.linkedin_url && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(lead.linkedin_url, '_blank')}
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
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
