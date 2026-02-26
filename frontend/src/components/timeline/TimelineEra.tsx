'use client';

import { TimelineEvent } from '@/components/timeline/TimelineEvent';
import type { TimelineEra as TimelineEraType } from '@/lib/timeline-data';

interface TimelineEraProps {
  era: TimelineEraType;
}

export function TimelineEra({ era }: TimelineEraProps) {
  return (
    <div className="mb-8">
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 ${era.color}`}>
        {era.name}
      </div>
      <div className="space-y-3 border-l-2 border-dark-border pl-6 ml-2">
        {era.events.map(event => (
          <TimelineEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
