
import { useState, useCallback } from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  category: string;
}

export const useColumnVisibility = () => {
  const [columns, setColumns] = useState<ColumnConfig[]>([
    // Basic Info
    { key: 'contact_info', label: 'Contact Info', visible: true, category: 'Basic' },
    { key: 'company_role', label: 'Company & Role', visible: true, category: 'Basic' },
    { key: 'location', label: 'Location', visible: true, category: 'Basic' },
    { key: 'status', label: 'Status', visible: true, category: 'Basic' },
    
    // Professional
    { key: 'experience', label: 'Experience', visible: false, category: 'Professional' },
    { key: 'skills', label: 'Skills', visible: false, category: 'Professional' },
    { key: 'education', label: 'Education', visible: false, category: 'Professional' },
    
    // Social & Links
    { key: 'social_links', label: 'Social Links', visible: false, category: 'Social' },
    
    // Actions (always visible)
    { key: 'actions', label: 'Actions', visible: true, category: 'System' }
  ]);

  const toggleColumn = useCallback((key: string) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  }, []);

  const toggleCategory = useCallback((category: string, visible: boolean) => {
    setColumns(prev => prev.map(col => 
      col.category === category ? { ...col, visible } : col
    ));
  }, []);

  const visibleColumns = columns.filter(col => col.visible);
  const categories = Array.from(new Set(columns.map(col => col.category)));

  return {
    columns,
    visibleColumns,
    categories,
    toggleColumn,
    toggleCategory
  };
};
