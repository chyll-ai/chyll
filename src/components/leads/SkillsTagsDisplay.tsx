
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SkillsTagsDisplayProps {
  skills?: string; // JSON string
  languages?: string; // JSON string
  maxVisible?: number;
  className?: string;
}

const SkillsTagsDisplay: React.FC<SkillsTagsDisplayProps> = ({
  skills,
  languages,
  maxVisible = 3,
  className = ""
}) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const parseSkills = (): string[] => {
    if (!skills) return [];
    try {
      const parsed = JSON.parse(skills);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseLanguages = (): string[] => {
    if (!languages) return [];
    try {
      const parsed = JSON.parse(languages);
      return Array.isArray(parsed) ? parsed.map(lang => typeof lang === 'string' ? lang : lang.name) : [];
    } catch {
      return [];
    }
  };

  const skillsList = parseSkills();
  const languagesList = parseLanguages();

  const renderTags = (items: string[], showAll: boolean, setShowAll: (show: boolean) => void, color: string) => {
    if (items.length === 0) return null;

    const visibleItems = showAll ? items : items.slice(0, maxVisible);
    const hasMore = items.length > maxVisible;

    return (
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {visibleItems.map((item, index) => (
            <Badge key={index} variant="outline" className={`text-xs ${color}`}>
              {item}
            </Badge>
          ))}
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="h-6 text-xs text-muted-foreground hover:text-foreground p-1"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                +{items.length - maxVisible} more
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  if (skillsList.length === 0 && languagesList.length === 0) {
    return <span className="text-xs text-muted-foreground">No skills/languages</span>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {skillsList.length > 0 && (
        <div>
          <span className="text-xs font-medium text-muted-foreground mb-1 block">Skills</span>
          {renderTags(skillsList, showAllSkills, setShowAllSkills, 'bg-blue-50 text-blue-700')}
        </div>
      )}
      
      {languagesList.length > 0 && (
        <div>
          <span className="text-xs font-medium text-muted-foreground mb-1 block">Languages</span>
          {renderTags(languagesList, showAllLanguages, setShowAllLanguages, 'bg-green-50 text-green-700')}
        </div>
      )}
    </div>
  );
};

export default SkillsTagsDisplay;
