'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { TimelineEra } from '@/components/timeline/TimelineEra';
import { TIMELINE_ERAS } from '@/lib/timeline-data';

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-2">
          Interactive Timeline
        </h1>
        <p className="text-dark-muted text-sm mb-8">
          Journey through Bible history from Creation to the Early Church
        </p>

        <div>
          {TIMELINE_ERAS.map(era => (
            <TimelineEra key={era.name} era={era} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
