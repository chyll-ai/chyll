
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  Building2
} from 'lucide-react';
import { useAssistantActions } from '@/hooks/useAssistantActions';
import { usePDLEnrichment } from '@/hooks/usePDLEnrichment';
import { useGmailSender } from '@/hooks/useGmailSender';
import LeadStatusSelector from '@/components/dashboard/LeadStatusSelector';
import LeadActionsMenu from '@/components/dashboard/LeadActionsMenu';
import SocialLinksDisplay from '@/components/leads/SocialLinksDisplay';
import CompanyInfoDisplay from '@/components/leads/CompanyInfoDisplay';
import SkillsTagsDisplay from '@/components/leads/SkillsTagsDisplay';
import LeadDetailCard from '@/components/leads/LeadDetailCard';
import { Lead } from '@/types/assistant';

const WorkspaceLeadTable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { leads, filteredLeads, loading, assistantActions } = useAssistantActions();
  const { enrichLead, enriching } = usePDLEnrichment();
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
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4 text-primary" />
            Enhanced Leads ({displayLeads.length})
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
      
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          <div className="min-w-[1400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[160px]">Contact</TableHead>
                  <TableHead className="min-w-[200px]">Company & Role</TableHead>
                  <TableHead className="min-w-[120px]">Experience</TableHead>
                  <TableHead className="min-w-[140px]">Skills</TableHead>
                  <TableHead className="min-w-[100px]">Social</TableHead>
                  <TableHead className="min-w-[120px]">Location</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
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
                      
                      {/* Contact Info */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm truncate max-w-[160px]" title={lead.full_name || 'N/A'}>
                            {lead.full_name || 'N/A'}
                          </div>
                          {lead.email && (
                            <a 
                              href={`mailto:${lead.email}`}
                              className="text-xs text-blue-600 hover:underline block truncate max-w-[160px]"
                              title={lead.email}
                            >
                              {lead.email}
                            </a>
                          )}
                          {lead.phone_number && (
                            <div className="text-xs text-muted-foreground truncate max-w-[160px]" title={lead.phone_number}>
                              {lead.phone_number}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Company & Role */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium truncate max-w-[200px]" title={lead.job_title || 'N/A'}>
                            {lead.job_title || 'N/A'}
                          </div>
                          <CompanyInfoDisplay
                            company={lead.company}
                            job_company_industry={lead.job_company_industry}
                            job_company_size={lead.job_company_size}
                            job_company_website={lead.job_company_website}
                            job_seniority={lead.job_seniority}
                          />
                        </div>
                      </TableCell>

                      {/* Experience */}
                      <TableCell>
                        <div className="space-y-1">
                          {lead.experience_years && (
                            <div className="text-sm font-medium">
                              {lead.experience_years} years
                            </div>
                          )}
                          {lead.headline && (
                            <div className="text-xs text-muted-foreground truncate max-w-[120px]" title={lead.headline}>
                              {lead.headline}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Skills */}
                      <TableCell>
                        <SkillsTagsDisplay
                          skills={lead.skills}
                          languages={lead.languages}
                          maxVisible={2}
                        />
                      </TableCell>

                      {/* Social Links */}
                      <TableCell>
                        <SocialLinksDisplay
                          linkedin_url={lead.linkedin_url}
                          github_url={lead.github_url}
                          twitter_url={lead.twitter_url}
                          facebook_url={lead.facebook_url}
                          job_company_website={lead.job_company_website}
                        />
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <div className="text-sm truncate max-w-[120px]" title={lead.location || 'N/A'}>
                          {lead.location || 'N/A'}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <LeadStatusSelector 
                          lead={lead} 
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              {selectedLead && <LeadDetailCard lead={selectedLead} />}
                            </DialogContent>
                          </Dialog>
                          <LeadActionsMenu 
                            lead={lead} 
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WorkspaceLeadTable;
