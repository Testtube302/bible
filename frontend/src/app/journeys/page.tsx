'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { JourneyCard } from '@/components/journey/JourneyCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useJourneys } from '@/hooks/useJourney';

export default function JourneysPage() {
  const { journeys, loading, fetchJourneys } = useJourneys();

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-2">Story Journeys</h1>
        <p className="text-dark-muted text-sm mb-6">
          Walk through the Bible&apos;s greatest narratives with AI-guided commentary
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {journeys.map(journey => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
