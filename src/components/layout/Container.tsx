import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  fluid?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className,
  fluid = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-none'
  };

  return (
    <div
      className={cn(
        'relative w-full mx-auto',
        !fluid && 'px-4 sm:px-6 lg:px-8',
        !fluid && sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container; 