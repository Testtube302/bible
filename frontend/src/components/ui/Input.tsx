'use client';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-lg bg-dark-card border border-dark-border px-4 py-2.5 text-dark-text placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-colors',
        className
      )}
      {...props}
    />
  );
}
