import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | string;
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 4,
  className,
  ...props
}) => {
  const getGridCols = () => {
    if (typeof cols === 'number') {
      return `grid-cols-1 sm:grid-cols-${cols}`;
    }

    return cn(
      'grid-cols-1',
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`
    );
  };

  const gapClass = typeof gap === 'number' ? `gap-${gap}` : gap;

  return (
    <div
      className={cn(
        'grid w-full',
        getGridCols(),
        gapClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid; 