import React from 'react';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", className)} />
  );
};

export default Spinner;
