
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
  Eye,
  ExternalLink
} from 'lucide-react';
import { useAssistantActions } from '@/hooks/useAssistantActions';
import { useApolloEnrichment } from '@/hooks/useApolloEnrichment';
import { useGmailSender } from '@/hooks/useGmailSender';

interface Lead {
  id: string;
  full_name: string;
  email?: string;
  company?: string;
  job_title?: string;
  status: string;
  linkedin_url?: string;
  linkedin_profile_data?: any;
  created_at: string;
}

const WorkspaceLeadTable: React.FC = () => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { leads, filteredLeads, loading, assistantActions } = useAssistantActions();
  const { enrichLead, enriching } = useApolloEnrichment();
  const { sendEmail, sending } = useGmailSender();

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
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Leads ({displayLeads.length})
          </CardTitle>
          
          {/* Actions pour leads sélectionnés */}
          {selectedLeads.length > 0 && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEnrichSelected}
                disabled={enriching}
              >
                <Zap className="h-4 w-4 mr-1" />
                Enrichir ({selectedLeads.length})
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSendEmailsSelected}
                disabled={sending}
              >
                <Mail className="h-4 w-4 mr-1" />
                Envoyer
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleArchiveSelected}
              >
                <Archive className="h-4 w-4 mr-1" />
                Archiver
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Société</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Chargement des leads...
                  </TableCell>
                </TableRow>
              ) : displayLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Aucun lead trouvé
                  </TableCell>
                </TableRow>
              ) : (
                displayLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {lead.full_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {lead.email ? (
                        <a 
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{lead.company || 'N/A'}</TableCell>
                    <TableCell>{lead.job_title || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => enrichLead(lead.id)}
                          disabled={enriching}
                        >
                          <Zap className="h-3 w-3" />
                        </Button>
                        {lead.email && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => sendEmail(lead.email!, 'Contact', 'Bonjour...')}
                            disabled={sending}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                        {lead.linkedin_url && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(lead.linkedin_url, '_blank')}
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
