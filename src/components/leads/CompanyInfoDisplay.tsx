
import React from 'react';
import { Building2, Users, Award, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { normalizeUrl } from '@/utils/urlUtils';

interface CompanyInfoDisplayProps {
  company: string;
  job_company_industry?: string;
  job_company_size?: string;
  job_company_website?: string;
  job_seniority?: string;
  className?: string;
}

const CompanyInfoDisplay: React.FC<CompanyInfoDisplayProps> = ({
  company,
  job_company_industry,
  job_company_size,
  job_company_website,
  job_seniority,
  className = ""
}) => {
  const normalizedWebsite = normalizeUrl(job_company_website);

  const getSizeColor = (size?: string) => {
    switch (size) {
      case 'startup': return 'bg-purple-100 text-purple-800';
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'large': return 'bg-orange-100 text-orange-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeniorityColor = (seniority?: string) => {
    switch (seniority) {
      case 'junior': return 'bg-emerald-100 text-emerald-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-orange-100 text-orange-800';
      case 'executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{company}</span>
        {normalizedWebsite && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-green-600"
            onClick={() => window.open(normalizedWebsite, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {job_company_industry && (
          <Badge variant="outline" className="text-xs">
            {job_company_industry}
          </Badge>
        )}
        
        {job_company_size && (
          <Badge className={`text-xs ${getSizeColor(job_company_size)}`}>
            <Users className="h-3 w-3 mr-1" />
            {job_company_size}
          </Badge>
        )}
        
        {job_seniority && (
          <Badge className={`text-xs ${getSeniorityColor(job_seniority)}`}>
            <Award className="h-3 w-3 mr-1" />
            {job_seniority}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CompanyInfoDisplay;
