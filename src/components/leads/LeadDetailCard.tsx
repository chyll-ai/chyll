
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Lead } from '@/types/assistant';
import SocialLinksDisplay from './SocialLinksDisplay';
import CompanyInfoDisplay from './CompanyInfoDisplay';
import SkillsTagsDisplay from './SkillsTagsDisplay';

interface LeadDetailCardProps {
  lead: Lead;
  className?: string;
}

const LeadDetailCard: React.FC<LeadDetailCardProps> = ({ lead, className = "" }) => {
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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              {lead.full_name}
            </CardTitle>
            {lead.headline && (
              <p className="text-sm text-muted-foreground font-medium">{lead.headline}</p>
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

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <div className="space-y-1 text-sm">
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
          </div>
        </div>

        <Separator />

        {/* Job Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Professional</h4>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{lead.job_title}</span>
            {lead.experience_years && (
              <Badge variant="outline" className="text-xs">
                {lead.experience_years}y exp
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
        </div>

        {lead.summary && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{lead.summary}</p>
            </div>
          </>
        )}

        {(lead.skills || lead.languages) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Skills & Languages</h4>
              <SkillsTagsDisplay skills={lead.skills} languages={lead.languages} />
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Education</h4>
              <div className="space-y-2">
                {education.slice(0, 2).map((edu: any, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{edu.school?.name || 'Unknown School'}</div>
                    {edu.degrees && edu.degrees.length > 0 && (
                      <div className="text-muted-foreground">{edu.degrees.join(', ')}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {certifications.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Certifications</h4>
              <div className="space-y-1">
                {certifications.slice(0, 3).map((cert: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{cert.name}</span>
                    {cert.organization && (
                      <span className="text-muted-foreground"> - {cert.organization}</span>
                    )}
                  </div>
                ))}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadDetailCard;
