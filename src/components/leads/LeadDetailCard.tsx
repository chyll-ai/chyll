import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Linkedin, ExternalLink } from 'lucide-react';
import { Lead } from '@/types/assistant';
import SocialLinksDisplay from './SocialLinksDisplay';
import CompanyInfoDisplay from './CompanyInfoDisplay';
import { normalizeUrl } from '@/utils/urlUtils';

interface LeadDetailCardProps {
  lead: Lead;
  className?: string;
}

const LeadDetailCard: React.FC<LeadDetailCardProps> = ({ lead, className = "" }) => {
  // Debug logging for LinkedIn URL
  console.log('LeadDetailCard - LinkedIn data:', {
    leadName: lead.full_name,
    linkedin_url: lead.linkedin_url,
    typeof_linkedin_url: typeof lead.linkedin_url
  });

  const parseEducation = () => {
    if (!lead.education) return [];
    try {
      const parsed = JSON.parse(lead.education);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseCertifications = () => {
    if (!lead.certifications) return [];
    try {
      const parsed = JSON.parse(lead.certifications);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const education = parseEducation();
  const certifications = parseCertifications();
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              {lead.full_name}
            </CardTitle>
            {lead.headline && (
              <p className="text-sm text-muted-foreground font-medium">{lead.headline}</p>
            )}
            {lead.experience_years && (
              <Badge variant="outline" className="text-xs">
                {lead.experience_years} years experience
              </Badge>
            )}
          </div>
          <SocialLinksDisplay
            linkedin_url={lead.linkedin_url}
            github_url={lead.github_url}
            twitter_url={lead.twitter_url}
            facebook_url={lead.facebook_url}
            job_company_website={lead.job_company_website}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                  {lead.email}
                </a>
              </div>
            )}
            {lead.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.phone_number}</span>
              </div>
            )}
            {lead.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{lead.location}</span>
              </div>
            )}
            {lead.mobile_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Mobile: {lead.mobile_phone}</span>
              </div>
            )}
          </div>
          
          {/* LinkedIn URL Section */}
          {lead.linkedin_url && (
            <div className="mt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => {
                  const urlToOpen = lead.linkedin_url.startsWith('http') 
                    ? lead.linkedin_url 
                    : `https://${lead.linkedin_url}`;
                  window.open(urlToOpen, '_blank', 'noopener,noreferrer');
                }}
              >
                <Linkedin className="h-4 w-4" />
                <span>View LinkedIn Profile</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Professional Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Professional Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{lead.job_title}</span>
              {lead.job_seniority && (
                <Badge variant="outline" className="text-xs">
                  {lead.job_seniority}
                </Badge>
              )}
            </div>
            <CompanyInfoDisplay
              company={lead.company}
              job_company_industry={lead.job_company_industry}
              job_company_size={lead.job_company_size}
              job_company_website={lead.job_company_website}
              job_seniority={lead.job_seniority}
            />
            {lead.management_level && (
              <div className="text-sm text-muted-foreground">
                Management Level: {lead.management_level}
              </div>
            )}
          </div>
        </div>

        {lead.summary && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Professional Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{lead.summary}</p>
            </div>
          </>
        )}

        {/* Education */}
        {education.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </h4>
              <div className="space-y-3">
                {education.slice(0, 3).map((edu: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-3">
                    <div className="font-medium text-sm">
                      {edu.school || 'Institution'}
                    </div>
                    {edu.degree && (
                      <div className="text-sm text-muted-foreground">{edu.degree}</div>
                    )}
                    {edu.field && (
                      <div className="text-xs text-muted-foreground">Field: {edu.field}</div>
                    )}
                    {edu.year && (
                      <div className="text-xs text-muted-foreground">Year: {edu.year}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </h4>
              <div className="flex flex-wrap gap-2">
                {certifications.slice(0, 5).map((cert: any, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {typeof cert === 'string' ? cert : cert.name || 'Certification'}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sales Data */}
        {(lead.mrr || lead.arr || lead.pipeline_stage) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Sales Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {lead.mrr && (
                  <div>
                    <span className="font-medium">MRR: </span>
                    <span className="text-green-600">${lead.mrr.toLocaleString()}</span>
                  </div>
                )}
                {lead.arr && (
                  <div>
                    <span className="font-medium">ARR: </span>
                    <span className="text-blue-600">${lead.arr.toLocaleString()}</span>
                  </div>
                )}
                {lead.pipeline_stage && (
                  <div className="col-span-2">
                    <span className="font-medium">Pipeline: </span>
                    <Badge variant="outline">{lead.pipeline_stage}</Badge>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Meta Information */}
        <Separator />
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Added: {new Date(lead.created_at).toLocaleDateString()}</span>
          </div>
          {lead.enriched_from && (
            <div>Source: {lead.enriched_from.source}</div>
          )}
          <div className="text-xs text-primary/70">
            Status: <Badge variant="outline" className="text-xs">{lead.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadDetailCard;
