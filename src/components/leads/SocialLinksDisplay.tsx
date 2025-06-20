
import React from 'react';
import { ExternalLink, Github, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialLinksDisplayProps {
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  job_company_website?: string;
  className?: string;
}

const SocialLinksDisplay: React.FC<SocialLinksDisplayProps> = ({
  linkedin_url,
  github_url,
  twitter_url,
  facebook_url,
  job_company_website,
  className = ""
}) => {
  // Helper function to ensure URL has protocol
  const ensureProtocol = (url: string | undefined) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const links = [
    { url: ensureProtocol(linkedin_url), icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600' },
    { url: ensureProtocol(github_url), icon: Github, label: 'GitHub', color: 'text-gray-800' },
    { url: ensureProtocol(twitter_url), icon: Twitter, label: 'Twitter', color: 'text-blue-400' },
    { url: ensureProtocol(facebook_url), icon: Facebook, label: 'Facebook', color: 'text-blue-700' },
    { url: ensureProtocol(job_company_website), icon: ExternalLink, label: 'Website', color: 'text-green-600' },
  ].filter(link => link.url);

  if (links.length === 0) {
    return <span className="text-xs text-muted-foreground">No links</span>;
  }

  return (
    <TooltipProvider>
      <div className={`flex gap-1 ${className}`}>
        {links.map((link, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${link.color} hover:bg-muted`}
                onClick={() => window.open(link.url!, '_blank', 'noopener,noreferrer')}
              >
                <link.icon className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialLinksDisplay;
