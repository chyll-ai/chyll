import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
  Building2,
  MapPin,
  Phone,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  Code,
  Database,
  Cloud,
  ChevronRight,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import { useAssistantActions } from '@/hooks/useAssistantActions';
import { usePDLEnrichment } from '@/hooks/usePDLEnrichment';
import { useGmailSender } from '@/hooks/useGmailSender';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import LeadStatusSelector from './LeadStatusSelector';
import LeadActionsMenu from './LeadActionsMenu';
import SocialLinksDisplay from '@/components/leads/SocialLinksDisplay';
import CompanyInfoDisplay from '@/components/leads/CompanyInfoDisplay';
import SkillsTagsDisplay from '@/components/leads/SkillsTagsDisplay';
import ColumnVisibilityControl from './ColumnVisibilityControl';
import { Lead } from '@/types/assistant';
import SalesDataEditor from '@/components/leads/SalesDataEditor';

const WorkspaceLeadTable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { leads, filteredLeads, loading, assistantActions } = useAssistantActions();
  const { enrichLead, enriching } = usePDLEnrichment();
  const { sendEmail, sending } = useGmailSender();
  const { columns, visibleColumns, categories, toggleColumn, toggleCategory } = useColumnVisibility();

  useEffect(() => {
    assistantActions.loadLeads();
  }, []);

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    console.log('Handle status update called:', leadId, newStatus);
    await assistantActions.loadLeads();
  };

  const handleSalesDataUpdate = async (leadId: string, salesData: any) => {
    console.log('Handle sales data update called:', leadId, salesData);
    await assistantActions.updateLeadSalesData(leadId, salesData);
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

  const parseJsonField = (field: string | undefined): string[] => {
    if (!field) return [];
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') {
            return item;
          } else if (typeof item === 'object' && item !== null) {
            // Handle objects by extracting meaningful string representation
            return item.name || item.school || item.title || Object.values(item).find(v => typeof v === 'string') || 'Unknown';
          }
          return String(item);
        });
      }
      return [];
    } catch {
      return [];
    }
  };

  const displayLeads = filteredLeads.length > 0 ? filteredLeads : leads;

  const renderContactInfo = (lead: Lead) => (
    <div className="space-y-1">
      <div className="font-medium text-sm truncate max-w-[180px]" title={lead.full_name || 'N/A'}>
        {lead.full_name || 'N/A'}
      </div>
      {lead.headline && (
        <div className="text-xs text-muted-foreground truncate max-w-[180px]" title={lead.headline}>
          {lead.headline}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {lead.email && (
          <a 
            href={`mailto:${lead.email}`}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            title={lead.email}
          >
            <Mail className="h-3 w-3" />
            <span className="truncate max-w-[140px]">{lead.email}</span>
          </a>
        )}
        {lead.phone_number && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span className="truncate max-w-[140px]">{lead.phone_number}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompanyRole = (lead: Lead) => (
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
  );

  const renderExperience = (lead: Lead) => (
    <div className="space-y-1">
      {lead.experience_years && (
        <div className="text-sm font-medium flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {lead.experience_years} years
        </div>
      )}
      {lead.job_seniority && (
        <Badge variant="outline" className="text-xs">
          {lead.job_seniority}
        </Badge>
      )}
      {lead.management_level && (
        <div className="text-xs text-muted-foreground">{lead.management_level}</div>
      )}
    </div>
  );

  const renderLinkedIn = (lead: Lead) => {    
    if (!lead.linkedin_url) {
      return <span className="text-xs text-muted-foreground">No LinkedIn</span>;
    }

    const urlToOpen = lead.linkedin_url.startsWith('http') 
      ? lead.linkedin_url 
      : `https://${lead.linkedin_url}`;

    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-blue-600 hover:bg-blue-50"
          onClick={() => window.open(urlToOpen, '_blank', 'noopener,noreferrer')}
        >
          <Linkedin className="h-3 w-3 mr-1" />
          <span className="text-xs truncate max-w-[120px]">LinkedIn</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
    );
  };

  const renderEducation = (lead: Lead) => {
    const educationData = parseJsonField(lead.education);
    const certificationsData = parseJsonField(lead.certifications);
    
    return (
      <div className="space-y-1">
        {educationData.length > 0 && (
          <div className="flex items-center gap-1">
            <GraduationCap className="h-3 w-3 text-green-500" />
            <div className="text-xs font-medium truncate max-w-[120px]">
              {educationData[0]}
            </div>
          </div>
        )}
        {certificationsData.length > 0 && (
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-yellow-500" />
            <Badge variant="outline" className="text-xs">
              {certificationsData.length} certs
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const renderSalesData = (lead: Lead) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Sales Data</div>
        <SalesDataEditor lead={lead} onUpdate={handleSalesDataUpdate} />
      </div>
      {lead.mrr && (
        <div className="flex items-center gap-1 text-xs">
          <DollarSign className="h-3 w-3 text-green-500" />
          <span>MRR: ${lead.mrr.toLocaleString()}</span>
        </div>
      )}
      {lead.arr && (
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="h-3 w-3 text-blue-500" />
          <span>ARR: ${lead.arr.toLocaleString()}</span>
        </div>
      )}
      {lead.pipeline_stage && (
        <Badge variant="outline" className="text-xs">
          {lead.pipeline_stage}
        </Badge>
      )}
    </div>
  );

  // Define the columns we want to show with all the populated data
  const tableColumns = [
    { key: 'contact_info', label: 'Contact Info', render: renderContactInfo },
    { key: 'company_role', label: 'Company & Role', render: renderCompanyRole },
    { key: 'experience', label: 'Experience', render: renderExperience },
    { key: 'linkedin', label: 'LinkedIn', render: renderLinkedIn },
    { key: 'education', label: 'Education', render: renderEducation },
    { key: 'sales_data', label: 'Sales Data', render: renderSalesData },
    { key: 'status', label: 'Status', render: (lead: Lead) => (
      <LeadStatusSelector lead={lead} onStatusUpdate={handleStatusUpdate} />
    )},
    { key: 'actions', label: 'Actions', render: (lead: Lead) => (
      <LeadActionsMenu 
        lead={lead} 
        onStatusUpdate={handleStatusUpdate}
      />
    )}
  ];

  return (
    <>
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="h-4 w-4 text-primary" />
              <span>Leads ({displayLeads.length})</span>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {selectedLeads.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleEnrichSelected}
                    disabled={enriching}
                    className="text-xs px-2 sm:px-3 h-8"
                  >
                    <Zap className="h-3 w-3 sm:mr-2" />
                    <span className="hidden sm:inline">Enrichir ({selectedLeads.length})</span>
                    <span className="sm:hidden">({selectedLeads.length})</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleSendEmailsSelected}
                    disabled={sending}
                    className="text-xs px-2 sm:px-3 h-8"
                  >
                    <Mail className="h-3 w-3 sm:mr-2" />
                    <span className="hidden sm:inline">Email</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleArchiveSelected}
                    className="text-xs px-2 sm:px-3 h-8"
                  >
                    <Archive className="h-3 w-3 sm:mr-2" />
                    <span className="hidden sm:inline">Archive</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="min-w-[1400px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm border-b">
                  <TableRow>
                    <TableHead className="w-12 pl-4">
                      <Checkbox
                        checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    {tableColumns.map(column => (
                      <TableHead key={column.key} className="min-w-[180px] text-xs font-medium">
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={tableColumns.length + 1} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="text-sm text-muted-foreground">Chargement des leads...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : displayLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={tableColumns.length + 1} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-8 w-8 text-muted-foreground/50" />
                          <span className="text-sm text-muted-foreground">Aucun lead trouvé</span>
                          <p className="text-xs text-muted-foreground/70">Commencez par demander à l'assistant de rechercher des prospects</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="pl-4">
                          <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                          />
                        </TableCell>
                        
                        {tableColumns.map(column => (
                          <TableCell key={column.key} className="max-w-[200px]">
                            {column.render(lead)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

export default WorkspaceLeadTable;
