'use client';

import Link from 'next/link';
import type { Journey } from '@/types/journey';

interface JourneyCardProps {
  journey: Journey;
}

export function JourneyCard({ journey }: JourneyCardProps) {
  const progressPercent = journey.progress
    ? Math.round((journey.progress.currentPassage / journey.passages.length) * 100)
    : 0;

  return (
    <Link href={`/journeys/${journey.slug}`}>
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-gold/30 transition-colors group">
        {/* Cover image */}
        <div className="relative h-36 bg-dark-surface overflow-hidden">
          {journey.coverImage && (
            <img
              src={journey.coverImage}
              alt={journey.title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
          {journey.era && (
            <span className="absolute top-3 left-3 bg-dark-bg/80 text-gold text-[10px] font-medium px-2 py-0.5 rounded-full">
              {journey.era}
            </span>
          )}
          {journey.progress?.completed && (
            <span className="absolute top-3 right-3 bg-gold/20 text-gold text-[10px] font-medium px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-gold font-serif text-base font-semibold mb-1">
            {journey.title}
          </h3>
          <p className="text-dark-muted text-xs leading-relaxed line-clamp-2 mb-3">
            {journey.description}
          </p>
          <div className="flex items-center justify-between text-[10px] text-dark-muted">
            <span>{journey.passages.length} passages</span>
            {journey.progress && !journey.progress.completed && (
              <span className="text-gold">{progressPercent}%</span>
            )}
          </div>
          {/* Progress bar */}
          {journey.progress && !journey.progress.completed && (
            <div className="mt-2 h-1 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
