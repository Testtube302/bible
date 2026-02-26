'use client';

import Link from 'next/link';
import type { TimelineEvent as TimelineEventType } from '@/lib/timeline-data';

interface TimelineEventProps {
  event: TimelineEventType;
}

export function TimelineEvent({ event }: TimelineEventProps) {
  return (
    <Link
      href={`/read/${encodeURIComponent(event.book)}/${event.chapter}`}
      className="block"
    >
      <div className="relative bg-dark-card border border-dark-border rounded-xl p-4 hover:border-gold/30 transition-colors">
        {/* Timeline dot */}
        <div className="absolute -left-[33px] top-5 w-3 h-3 rounded-full bg-dark-border border-2 border-dark-bg" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-gold font-serif text-sm font-semibold mb-1">
              {event.title}
            </p>
            <p className="text-dark-muted text-xs leading-relaxed mb-2">
              {event.description}
            </p>
            <p className="text-dark-muted text-[10px]">
              {event.book} {event.chapter}:{event.verseStart}-{event.verseEnd}
            </p>
          </div>
          <span className="text-dark-muted text-[10px] whitespace-nowrap mt-0.5">
            {event.yearLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
