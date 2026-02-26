'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ArtworkBackground } from '@/components/ui/ArtworkBackground';
import { TimelineEra } from '@/components/timeline/TimelineEra';
import { TIMELINE_ERAS } from '@/lib/timeline-data';

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <ArtworkBackground
        src="/bible/artwork/dore/creation-of-light.webp"
        alt="The Creation of Light by Gustave Doré"
        overlay="heavy"
        className="min-h-[30vh] flex items-end"
      >
        <div className="max-w-3xl mx-auto px-4 py-10 w-full">
          <h1 className="text-gold font-serif text-3xl sm:text-4xl font-bold mb-2">
            Interactive Timeline
          </h1>
          <p className="text-cream/70 text-sm sm:text-base">
            Journey through Bible history from Creation to the Early Church
          </p>
        </div>
      </ArtworkBackground>

      <main className="max-w-3xl mx-auto px-4 py-6">
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
