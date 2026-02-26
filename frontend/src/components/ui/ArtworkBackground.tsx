'use client';

import { cn } from '@/lib/utils';

interface ArtworkBackgroundProps {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
  overlay?: 'light' | 'medium' | 'heavy';
}

export function ArtworkBackground({
  src,
  alt,
  children,
  className,
  overlay = 'medium',
}: ArtworkBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={alt}
      />

      {/* Gradient overlay */}
      <div
        className={cn('absolute inset-0', {
          'bg-gradient-to-b from-dark-bg/40 via-dark-bg/60 to-dark-bg': overlay === 'light',
          'bg-gradient-to-b from-dark-bg/50 via-dark-bg/75 to-dark-bg': overlay === 'medium',
          'bg-gradient-to-b from-dark-bg/70 via-dark-bg/85 to-dark-bg': overlay === 'heavy',
        })}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
