import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  Eye,
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
  ChevronRight
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
import LeadDetailCard from '@/components/leads/LeadDetailCard';
import ColumnVisibilityControl from './ColumnVisibilityControl';
import { Lead } from '@/types/assistant';
import SalesDataEditor from '@/components/leads/SalesDataEditor';

const WorkspaceLeadTable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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

  const parseJsonField = (field: string | undefined): any[] => {
    if (!field) return [];
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
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

  const renderLocation = (lead: Lead) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-sm">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="truncate max-w-[140px]" title={lead.location || 'N/A'}>
          {lead.location || 'N/A'}
        </span>
      </div>
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
    </div>
  );

  const renderSkills = (lead: Lead) => (
    <div className="space-y-1">
      <SkillsTagsDisplay
        skills={lead.skills}
        languages={lead.languages}
        maxVisible={3}
      />
    </div>
  );

  const renderEducation = (lead: Lead) => (
    <div className="space-y-1">
      {parseJsonField(lead.education).length > 0 && (
        <div className="flex items-center gap-1">
          <GraduationCap className="h-3 w-3 text-green-500" />
          <div className="text-xs font-medium">
            {parseJsonField(lead.education).slice(0, 1).join(', ')}
          </div>
        </div>
      )}
      {parseJsonField(lead.certifications).length > 0 && (
        <div className="flex items-center gap-1">
          <Award className="h-3 w-3 text-yellow-500" />
          <Badge variant="outline" className="text-xs">
            {parseJsonField(lead.certifications).length} certs
          </Badge>
        </div>
      )}
    </div>
  );

  const renderSocialLinks = (lead: Lead) => (
    <div className="space-y-1">
      <SocialLinksDisplay
        linkedin_url={lead.linkedin_url}
        github_url={lead.github_url}
        twitter_url={lead.twitter_url}
        facebook_url={lead.facebook_url}
        job_company_website={lead.job_company_website}
      />
    </div>
  );

  const renderJobHistory = (lead: Lead) => (
    <div className="space-y-1">
      {lead.job_history && (
        <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={lead.job_history}>
          {lead.job_history}
        </div>
      )}
      {lead.job_start_date && (
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          <span>{lead.job_start_date}</span>
          {lead.job_end_date && <span> - {lead.job_end_date}</span>}
        </div>
      )}
      {lead.job_duration_months && (
        <Badge variant="outline" className="text-xs">
          {lead.job_duration_months} months
        </Badge>
      )}
    </div>
  );

  const renderCompanyDetails = (lead: Lead) => (
    <div className="space-y-1">
      {lead.job_company_founded_year && (
        <div className="flex items-center gap-1 text-xs">
          <Building2 className="h-3 w-3" />
          <span>Founded {lead.job_company_founded_year}</span>
        </div>
      )}
      {lead.job_company_industry && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.job_company_industry}>
          {lead.job_company_industry}
        </div>
      )}
      {lead.job_company_tags && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.job_company_tags}>
          Tags: {lead.job_company_tags}
        </div>
      )}
    </div>
  );

  const renderCompanyMetrics = (lead: Lead) => (
    <div className="space-y-1">
      {lead.job_company_employees_count && (
        <div className="flex items-center gap-1 text-xs">
          <Users className="h-3 w-3" />
          <span>{lead.job_company_employees_count.toLocaleString()} employees</span>
        </div>
      )}
      {lead.job_company_size && (
        <Badge variant="outline" className="text-xs">
          {lead.job_company_size}
        </Badge>
      )}
    </div>
  );

  const renderCompanyFunding = (lead: Lead) => (
    <div className="space-y-1">
      {lead.job_company_revenue && (
        <div className="flex items-center gap-1 text-xs">
          <DollarSign className="h-3 w-3" />
          <span className="truncate max-w-[120px]" title={lead.job_company_revenue}>
            {lead.job_company_revenue}
          </span>
        </div>
      )}
      {lead.job_company_funding && (
        <div className="text-xs text-muted-foreground truncate max-w-[120px]" title={lead.job_company_funding}>
          Funding: {lead.job_company_funding}
        </div>
      )}
    </div>
  );

  const renderPersonalDetails = (lead: Lead) => (
    <div className="space-y-1">
      {lead.birth_year && (
        <div className="text-xs">Age: {new Date().getFullYear() - lead.birth_year}</div>
      )}
      {lead.gender && (
        <div className="text-xs text-muted-foreground">{lead.gender}</div>
      )}
      {lead.family_status && (
        <Badge variant="outline" className="text-xs">
          {lead.family_status}
        </Badge>
      )}
    </div>
  );

  const renderDemographics = (lead: Lead) => (
    <div className="space-y-1">
      {lead.country && (
        <div className="flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3" />
          <span>{lead.country}</span>
        </div>
      )}
      {lead.time_zone && (
        <div className="text-xs text-muted-foreground">{lead.time_zone}</div>
      )}
    </div>
  );

  const renderLifestyle = (lead: Lead) => (
    <div className="space-y-1">
      {lead.lifestyle_interests && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.lifestyle_interests}>
          {lead.lifestyle_interests}
        </div>
      )}
      {lead.fitness_activities && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.fitness_activities}>
          Fitness: {lead.fitness_activities}
        </div>
      )}
    </div>
  );

  const renderPreferences = (lead: Lead) => (
    <div className="space-y-1">
      {lead.work_preferences && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.work_preferences}>
          Work: {lead.work_preferences}
        </div>
      )}
      {lead.travel_preferences && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.travel_preferences}>
          Travel: {lead.travel_preferences}
        </div>
      )}
    </div>
  );

  const renderSocialMetrics = (lead: Lead) => (
    <div className="space-y-1">
      {lead.linkedin_connections && (
        <div className="flex items-center gap-1 text-xs">
          <Users className="h-3 w-3 text-blue-500" />
          <span>{lead.linkedin_connections.toLocaleString()} connections</span>
        </div>
      )}
      {lead.github_repos && (
        <div className="flex items-center gap-1 text-xs">
          <Code className="h-3 w-3 text-gray-700" />
          <span>{lead.github_repos} repos</span>
        </div>
      )}
      {lead.twitter_followers && (
        <div className="flex items-center gap-1 text-xs">
          <Users className="h-3 w-3 text-sky-500" />
          <span>{lead.twitter_followers.toLocaleString()} followers</span>
        </div>
      )}
    </div>
  );

  const renderTechSkills = (lead: Lead) => (
    <div className="space-y-1">
      {lead.programming_languages && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.programming_languages}>
          <Code className="h-3 w-3 inline mr-1" />
          {lead.programming_languages}
        </div>
      )}
      {lead.technology_skills && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.technology_skills}>
          Tech: {lead.technology_skills}
        </div>
      )}
    </div>
  );

  const renderToolsPlatforms = (lead: Lead) => (
    <div className="space-y-1">
      {lead.cloud_platforms && (
        <div className="flex items-center gap-1 text-xs">
          <Cloud className="h-3 w-3" />
          <span className="truncate max-w-[120px]" title={lead.cloud_platforms}>
            {lead.cloud_platforms}
          </span>
        </div>
      )}
      {lead.databases_used && (
        <div className="flex items-center gap-1 text-xs">
          <Database className="h-3 w-3" />
          <span className="truncate max-w-[120px]" title={lead.databases_used}>
            {lead.databases_used}
          </span>
        </div>
      )}
    </div>
  );

  const renderAchievements = (lead: Lead) => (
    <div className="space-y-1">
      {lead.awards && (
        <div className="flex items-center gap-1 text-xs">
          <Award className="h-3 w-3 text-yellow-500" />
          <span className="truncate max-w-[120px]" title={lead.awards}>
            {lead.awards}
          </span>
        </div>
      )}
      {lead.patents && (
        <div className="text-xs text-muted-foreground truncate max-w-[120px]" title={lead.patents}>
          Patents: {lead.patents}
        </div>
      )}
    </div>
  );

  const renderPublications = (lead: Lead) => (
    <div className="space-y-1">
      {lead.publications && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.publications}>
          {lead.publications}
        </div>
      )}
      {lead.volunteer_work && (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={lead.volunteer_work}>
          Volunteer: {lead.volunteer_work}
        </div>
      )}
    </div>
  );

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
    </div>
  );

  const renderPipelineStage = (lead: Lead) => (
    <div className="space-y-1">
      {lead.pipeline_stage && (
        <Badge variant="outline" className="text-xs">
          {lead.pipeline_stage}
        </Badge>
      )}
      {lead.close_probability !== null && lead.close_probability !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          <Target className="h-3 w-3" />
          <span>{lead.close_probability}%</span>
        </div>
      )}
    </div>
  );

  const renderRevenueMetrics = (lead: Lead) => (
    <div className="space-y-1">
      <div className="grid grid-cols-1 gap-1">
        {lead.mrr && (
          <div className="text-xs">
            <span className="text-muted-foreground">MRR:</span> ${lead.mrr.toLocaleString()}
          </div>
        )}
        {lead.arr && (
          <div className="text-xs">
            <span className="text-muted-foreground">ARR:</span> ${lead.arr.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );

  const renderDealTimeline = (lead: Lead) => (
    <div className="space-y-1">
      {lead.expected_close_date && (
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          <span>Close: {new Date(lead.expected_close_date).toLocaleDateString()}</span>
        </div>
      )}
      {lead.last_activity_date && (
        <div className="text-xs text-muted-foreground">
          Last activity: {new Date(lead.last_activity_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 text-primary" />
            <span>Leads ({displayLeads.length})</span>
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <ColumnVisibilityControl
              columns={columns}
              categories={categories}
              onToggleColumn={toggleColumn}
              onToggleCategory={toggleCategory}
            />
            
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
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm border-b">
                <TableRow>
                  <TableHead className="w-12 pl-4">
                    <Checkbox
                      checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {visibleColumns.map(column => (
                    <TableHead key={column.key} className="min-w-[180px] text-xs font-medium">
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Chargement des leads...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="text-center py-12">
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
                      
                      {visibleColumns.map(column => (
                        <TableCell key={column.key} className="max-w-[200px]">
                          {column.key === 'contact_info' && (
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
                          )}
                          {column.key === 'company_role' && (
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
                          )}
                          {column.key === 'status' && (
                            <LeadStatusSelector 
                              lead={lead} 
                              onStatusUpdate={handleStatusUpdate}
                            />
                          )}
                          {column.key === 'actions' && (
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
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  {selectedLead && <LeadDetailCard lead={selectedLead} />}
                                </DialogContent>
                              </Dialog>
                              <LeadActionsMenu 
                                lead={lead} 
                                onStatusUpdate={handleStatusUpdate}
                              />
                            </div>
                          )}
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
  );
};

export default WorkspaceLeadTable;
