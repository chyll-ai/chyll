
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
    
    // Sales & Pipeline
    { key: 'sales_data', label: 'Sales Data', visible: false, category: 'Sales' },
    { key: 'pipeline_stage', label: 'Pipeline Stage', visible: false, category: 'Sales' },
    { key: 'revenue_metrics', label: 'Revenue Metrics', visible: false, category: 'Sales' },
    { key: 'deal_timeline', label: 'Deal Timeline', visible: false, category: 'Sales' },
    
    // Professional
    { key: 'experience', label: 'Experience', visible: false, category: 'Professional' },
    { key: 'skills', label: 'Skills', visible: false, category: 'Professional' },
    { key: 'education', label: 'Education', visible: false, category: 'Professional' },
    { key: 'job_history', label: 'Job History', visible: false, category: 'Professional' },
    { key: 'management_level', label: 'Management Level', visible: false, category: 'Professional' },
    { key: 'departments', label: 'Departments', visible: false, category: 'Professional' },
    { key: 'job_functions', label: 'Job Functions', visible: false, category: 'Professional' },
    
    // Company Details
    { key: 'company_details', label: 'Company Details', visible: false, category: 'Company' },
    { key: 'company_metrics', label: 'Company Metrics', visible: false, category: 'Company' },
    { key: 'company_funding', label: 'Company Funding', visible: false, category: 'Company' },
    
    // Personal Info
    { key: 'personal_details', label: 'Personal Details', visible: false, category: 'Personal' },
    { key: 'demographics', label: 'Demographics', visible: false, category: 'Personal' },
    { key: 'lifestyle', label: 'Lifestyle', visible: false, category: 'Personal' },
    { key: 'preferences', label: 'Preferences', visible: false, category: 'Personal' },
    
    // Social & Links
    { key: 'social_links', label: 'Social Links', visible: false, category: 'Social' },
    { key: 'social_metrics', label: 'Social Metrics', visible: false, category: 'Social' },
    
    // Technology
    { key: 'tech_skills', label: 'Tech Skills', visible: false, category: 'Technology' },
    { key: 'tools_platforms', label: 'Tools & Platforms', visible: false, category: 'Technology' },
    
    // Achievements
    { key: 'achievements', label: 'Achievements', visible: false, category: 'Achievements' },
    { key: 'publications', label: 'Publications', visible: false, category: 'Achievements' },
    
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
