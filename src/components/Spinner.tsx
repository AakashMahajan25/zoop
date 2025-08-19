'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'sm', className = '' }: SpinnerProps) {
  const dimension = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6';
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin ${dimension} rounded-full border-2 border-current border-t-transparent align-[-0.125em] ${className}`}
    />
  );
}

export default Spinner;


