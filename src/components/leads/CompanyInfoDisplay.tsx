
import React from 'react';
import { Building2, Users, Award, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  // Simple URL normalization function
  const ensureProtocol = (url: string | undefined): string | null => {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    const cleanUrl = url.trim();
    if (!cleanUrl) return null;
    
    // Add protocol if missing
    if (!cleanUrl.startsWith('http')) {
      return `https://${cleanUrl}`;
    }
    
    return cleanUrl;
  };

  const normalizedWebsite = ensureProtocol(job_company_website);

  const getSizeColor = (size?: string) => {
    if (!size || typeof size !== 'string') return 'bg-gray-100 text-gray-800';
    
    switch (size.toLowerCase()) {
      case 'startup': return 'bg-purple-100 text-purple-800';
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'large': return 'bg-orange-100 text-orange-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeniorityColor = (seniority?: string) => {
    if (!seniority || typeof seniority !== 'string') return 'bg-gray-100 text-gray-800';
    
    switch (seniority.toLowerCase()) {
      case 'junior': return 'bg-emerald-100 text-emerald-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-orange-100 text-orange-800';
      case 'executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Ensure all values are strings and handle potential objects
  const safeCompany = typeof company === 'string' ? company : String(company || 'N/A');
  const safeIndustry = typeof job_company_industry === 'string' ? job_company_industry : '';
  const safeSize = typeof job_company_size === 'string' ? job_company_size : '';
  const safeSeniority = typeof job_seniority === 'string' ? job_seniority : '';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{safeCompany}</span>
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
        {safeIndustry && (
          <Badge variant="outline" className="text-xs">
            {safeIndustry}
          </Badge>
        )}
        
        {safeSize && (
          <Badge className={`text-xs ${getSizeColor(safeSize)}`}>
            <Users className="h-3 w-3 mr-1" />
            {safeSize}
          </Badge>
        )}
        
        {safeSeniority && (
          <Badge className={`text-xs ${getSeniorityColor(safeSeniority)}`}>
            <Award className="h-3 w-3 mr-1" />
            {safeSeniority}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CompanyInfoDisplay;
