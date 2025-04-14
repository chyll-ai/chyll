
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { searchDocumentation } from '@/utils/search';
import { Route } from '@/types/search';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';

interface DocSearchProps {
  containerClassName?: string;
  placeholder?: string;
}

const DocSearch = ({ containerClassName = '', placeholder }: DocSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Route[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (query.trim() !== '') {
      const searchResults = searchDocumentation(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (route: string) => {
    navigate(route);
    setOpen(false);
    setQuery('');
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setQuery('');
    }
  };

  const defaultPlaceholder = t('search_docs');

  return (
    <div className={`relative ${containerClassName}`}>
      <div className="relative" onClick={() => setOpen(true)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={placeholder || defaultPlaceholder}
          readOnly
          onClick={() => setOpen(true)}
        />
      </div>
      
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command>
          <CommandInput 
            placeholder={t('search_documentation')}
            value={query}
            onValueChange={setQuery}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>{t('no_results_found')}</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading={t('documentation')}>
                {results.map((result, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelect(result.path)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-sm text-gray-500 truncate">{result.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default DocSearch;
