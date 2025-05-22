
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface LeadFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
  statusOptions: string[];
}

const LeadFilterBar: React.FC<LeadFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatuses,
  setSelectedStatuses,
  statusOptions
}) => {
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedStatuses([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-grow max-w-md">
          <Input
            type="text"
            placeholder="Rechercher par nom, poste ou entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {(searchQuery || selectedStatuses.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Effacer tous les filtres
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 self-center">Filtrer par statut:</span>
        {statusOptions.map(status => (
          <Badge
            key={status}
            variant={selectedStatuses.includes(status) ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedStatuses.includes(status) ? "bg-primary" : ""
            }`}
            onClick={() => toggleStatus(status)}
          >
            {status}
            {selectedStatuses.includes(status) && (
              <X className="ml-1 h-3 w-3" onClick={(e) => {
                e.stopPropagation();
                setSelectedStatuses(selectedStatuses.filter(s => s !== status));
              }} />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default LeadFilterBar;
