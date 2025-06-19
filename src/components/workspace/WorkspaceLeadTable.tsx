
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
  Calendar,
  Phone,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Heart,
  Home,
  Car,
  Baby,
  Dumbbell
} from 'lucide-react';
import { useAssistantActions } from '@/hooks/useAssistantActions';
import { usePDLEnrichment } from '@/hooks/usePDLEnrichment';
import { useGmailSender } from '@/hooks/useGmailSender';
import LeadStatusSelector from './LeadStatusSelector';
import LeadActionsMenu from './LeadActionsMenu';
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
          <div className="min-w-[2400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[180px]">Contact Info</TableHead>
                  <TableHead className="min-w-[200px]">Company & Role</TableHead>
                  <TableHead className="min-w-[160px]">Location & Demographics</TableHead>
                  <TableHead className="min-w-[140px]">Experience & Seniority</TableHead>
                  <TableHead className="min-w-[180px]">Skills & Technology</TableHead>
                  <TableHead className="min-w-[160px]">Education & Credentials</TableHead>
                  <TableHead className="min-w-[140px]">Social Presence</TableHead>
                  <TableHead className="min-w-[160px]">Personal Interests</TableHead>
                  <TableHead className="min-w-[140px]">Lifestyle & Preferences</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : displayLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
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
                            {lead.work_email && lead.work_email !== lead.email && (
                              <a 
                                href={`mailto:${lead.work_email}`}
                                className="text-xs text-green-600 hover:underline flex items-center gap-1"
                                title={`Work: ${lead.work_email}`}
                              >
                                <Briefcase className="h-3 w-3" />
                                <span className="truncate max-w-[140px]">{lead.work_email}</span>
                              </a>
                            )}
                            {(lead.phone_number || lead.mobile_phone || lead.work_phone) && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span className="truncate max-w-[140px]">
                                  {lead.mobile_phone || lead.phone_number || lead.work_phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Company & Role */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium truncate max-w-[200px]" title={lead.job_title || 'N/A'}>
                            {lead.job_title || 'N/A'}
                          </div>
                          {lead.management_level && (
                            <Badge variant="outline" className="text-xs">
                              {lead.management_level}
                            </Badge>
                          )}
                          <CompanyInfoDisplay
                            company={lead.company}
                            job_company_industry={lead.job_company_industry}
                            job_company_size={lead.job_company_size}
                            job_company_website={lead.job_company_website}
                            job_seniority={lead.job_seniority}
                          />
                          {lead.job_company_employees_count && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {lead.job_company_employees_count.toLocaleString()} employees
                            </div>
                          )}
                          {lead.job_company_revenue && (
                            <div className="text-xs text-muted-foreground">
                              Revenue: {lead.job_company_revenue}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Location & Demographics */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[140px]" title={lead.location || lead.city || 'N/A'}>
                              {lead.city || lead.location || 'N/A'}
                            </span>
                          </div>
                          {lead.state && (
                            <div className="text-xs text-muted-foreground">{lead.state}</div>
                          )}
                          {lead.country && (
                            <div className="text-xs text-muted-foreground">{lead.country}</div>
                          )}
                          {lead.time_zone && (
                            <div className="text-xs text-muted-foreground">TZ: {lead.time_zone}</div>
                          )}
                          <div className="flex gap-1">
                            {lead.gender && (
                              <Badge variant="secondary" className="text-xs">{lead.gender}</Badge>
                            )}
                            {lead.birth_year && (
                              <Badge variant="secondary" className="text-xs">
                                {new Date().getFullYear() - lead.birth_year}y
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Experience & Seniority */}
                      <TableCell>
                        <div className="space-y-1">
                          {lead.experience_years && (
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {lead.experience_years} years
                            </div>
                          )}
                          {lead.job_duration_months && (
                            <div className="text-xs text-muted-foreground">
                              Current role: {Math.floor(lead.job_duration_months / 12)}y {lead.job_duration_months % 12}m
                            </div>
                          )}
                          {parseJsonField(lead.departments).length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Dept: {parseJsonField(lead.departments).slice(0, 2).join(', ')}
                            </div>
                          )}
                          {parseJsonField(lead.job_functions).length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {parseJsonField(lead.job_functions).slice(0, 1).join(', ')}
                            </div>
                          )}
                          {lead.salary_range && (
                            <Badge variant="outline" className="text-xs">
                              {lead.salary_range}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Skills & Technology */}
                      <TableCell>
                        <div className="space-y-1">
                          <SkillsTagsDisplay
                            skills={lead.skills}
                            languages={lead.languages}
                            maxVisible={3}
                          />
                          {parseJsonField(lead.technology_skills).length > 0 && (
                            <div className="flex items-center gap-1">
                              <Code className="h-3 w-3 text-blue-500" />
                              <div className="text-xs">
                                {parseJsonField(lead.technology_skills).slice(0, 2).map((skill, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs mr-1">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {parseJsonField(lead.programming_languages).length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Lang: {parseJsonField(lead.programming_languages).slice(0, 3).join(', ')}
                            </div>
                          )}
                          {parseJsonField(lead.software_proficiency).length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Tools: {parseJsonField(lead.software_proficiency).slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Education & Credentials */}
                      <TableCell>
                        <div className="space-y-1">
                          {parseJsonField(lead.degree_names).length > 0 && (
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3 text-green-500" />
                              <div className="text-xs font-medium">
                                {parseJsonField(lead.degree_names).slice(0, 1).join(', ')}
                              </div>
                            </div>
                          )}
                          {parseJsonField(lead.school_names).length > 0 && (
                            <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                              {parseJsonField(lead.school_names).slice(0, 1).join(', ')}
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
                          {parseJsonField(lead.awards).length > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-purple-500" />
                              <Badge variant="outline" className="text-xs">
                                {parseJsonField(lead.awards).length} awards
                              </Badge>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Social Presence */}
                      <TableCell>
                        <div className="space-y-1">
                          <SocialLinksDisplay
                            linkedin_url={lead.linkedin_url}
                            github_url={lead.github_url}
                            twitter_url={lead.twitter_url}
                            facebook_url={lead.facebook_url}
                            job_company_website={lead.job_company_website}
                          />
                          <div className="flex gap-1 text-xs">
                            {lead.linkedin_connections && (
                              <Badge variant="outline" className="text-xs">
                                {lead.linkedin_connections.toLocaleString()} LinkedIn
                              </Badge>
                            )}
                            {lead.github_followers && (
                              <Badge variant="outline" className="text-xs">
                                {lead.github_followers} GitHub
                              </Badge>
                            )}
                          </div>
                          {lead.twitter_followers && (
                            <div className="text-xs text-muted-foreground">
                              {lead.twitter_followers.toLocaleString()} Twitter followers
                            </div>
                          )}
                          {lead.recommendations_received && (
                            <div className="text-xs text-muted-foreground">
                              {lead.recommendations_received} recommendations
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Personal Interests */}
                      <TableCell>
                        <div className="space-y-1">
                          {parseJsonField(lead.interests).length > 0 && (
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-500" />
                              <div className="text-xs">
                                {parseJsonField(lead.interests).slice(0, 2).map((interest, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs mr-1">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {parseJsonField(lead.fitness_activities).length > 0 && (
                            <div className="flex items-center gap-1">
                              <Dumbbell className="h-3 w-3 text-blue-500" />
                              <div className="text-xs">
                                {parseJsonField(lead.fitness_activities).slice(0, 2).join(', ')}
                              </div>
                            </div>
                          )}
                          {parseJsonField(lead.volunteer_work).length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Volunteer
                            </Badge>
                          )}
                          {lead.political_affiliation && (
                            <div className="text-xs text-muted-foreground">
                              Politics: {lead.political_affiliation}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Lifestyle & Preferences */}
                      <TableCell>
                        <div className="space-y-1">
                          {lead.family_status && (
                            <Badge variant="outline" className="text-xs">
                              {lead.family_status}
                            </Badge>
                          )}
                          {lead.children_count !== undefined && lead.children_count > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Baby className="h-3 w-3 text-pink-500" />
                              {lead.children_count} children
                            </div>
                          )}
                          {lead.home_ownership && (
                            <div className="flex items-center gap-1 text-xs">
                              <Home className="h-3 w-3 text-green-500" />
                              {lead.home_ownership}
                            </div>
                          )}
                          {parseJsonField(lead.vehicle_ownership).length > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Car className="h-3 w-3 text-blue-500" />
                              {parseJsonField(lead.vehicle_ownership).length} vehicles
                            </div>
                          )}
                          {parseJsonField(lead.travel_preferences).length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Travel: {parseJsonField(lead.travel_preferences).slice(0, 1).join(', ')}
                            </div>
                          )}
                          {lead.net_worth && (
                            <Badge variant="outline" className="text-xs">
                              {lead.net_worth}
                            </Badge>
                          )}
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
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
