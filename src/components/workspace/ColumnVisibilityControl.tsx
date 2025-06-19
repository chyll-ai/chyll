
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { ColumnConfig } from '@/hooks/useColumnVisibility';

interface ColumnVisibilityControlProps {
  columns: ColumnConfig[];
  categories: string[];
  onToggleColumn: (key: string) => void;
  onToggleCategory: (category: string, visible: boolean) => void;
}

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({
  columns,
  categories,
  onToggleColumn,
  onToggleCategory
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-3">Column Visibility</h4>
            
            {categories.filter(cat => cat !== 'System').map(category => {
              const categoryColumns = columns.filter(col => col.category === category);
              const allVisible = categoryColumns.every(col => col.visible);
              const someVisible = categoryColumns.some(col => col.visible);
              const isIndeterminate = someVisible && !allVisible;
              
              return (
                <div key={category} className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={allVisible}
                      {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                      onCheckedChange={(checked) => onToggleCategory(category, checked as boolean)}
                    />
                    <span className="text-sm font-medium">{category}</span>
                    {allVisible ? (
                      <Eye className="h-3 w-3 text-green-500" />
                    ) : someVisible ? (
                      <EyeOff className="h-3 w-3 text-yellow-500" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="ml-6 space-y-1">
                    {categoryColumns.map(column => (
                      <div key={column.key} className="flex items-center gap-2">
                        <Checkbox
                          checked={column.visible}
                          onCheckedChange={() => onToggleColumn(column.key)}
                        />
                        <span className="text-xs text-muted-foreground">{column.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnVisibilityControl;
