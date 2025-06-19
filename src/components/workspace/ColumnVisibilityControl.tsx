
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Eye, EyeOff, ChevronDown } from 'lucide-react';
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
  const visibleCount = columns.filter(col => col.visible).length;
  const totalCount = columns.filter(col => col.category !== 'System').length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8 px-3">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Columns</span>
          <span className="text-xs text-muted-foreground">({visibleCount}/{totalCount})</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b bg-muted/30">
          <h4 className="font-medium text-sm">Column Visibility</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Show/hide columns to customize your view
          </p>
        </div>
        
        <ScrollArea className="h-96">
          <div className="p-4 space-y-4">
            {categories.filter(cat => cat !== 'System').map(category => {
              const categoryColumns = columns.filter(col => col.category === category);
              const allVisible = categoryColumns.every(col => col.visible);
              const someVisible = categoryColumns.some(col => col.visible);
              const isIndeterminate = someVisible && !allVisible;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/20 hover:bg-muted/30 transition-colors">
                    <Checkbox
                      checked={allVisible}
                      {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                      onCheckedChange={(checked) => onToggleCategory(category, checked as boolean)}
                    />
                    <span className="text-sm font-medium flex-1">{category}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{categoryColumns.filter(col => col.visible).length}/{categoryColumns.length}</span>
                      {allVisible ? (
                        <Eye className="h-3 w-3 text-green-600" />
                      ) : someVisible ? (
                        <EyeOff className="h-3 w-3 text-amber-600" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6 space-y-1">
                    {categoryColumns.map(column => (
                      <label 
                        key={column.key} 
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/20 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={column.visible}
                          onCheckedChange={() => onToggleColumn(column.key)}
                        />
                        <span className="text-xs flex-1">{column.label}</span>
                        {column.visible && (
                          <Eye className="h-3 w-3 text-green-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total visible: {visibleCount} columns</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => {
                // Reset to default (show only basic columns)
                categories.forEach(cat => {
                  onToggleCategory(cat, cat === 'Basic');
                });
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnVisibilityControl;
