'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ArtworkBackground } from '@/components/ui/ArtworkBackground';
import { TopicCard } from '@/components/topics/TopicCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTopics } from '@/hooks/useTopics';

export default function TopicsPage() {
  const { topics, loading, fetchTopics } = useTopics();

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <ArtworkBackground
        src="/bible/artwork/dore/sermon-on-mount.webp"
        alt="The Sermon on the Mount by Gustave Doré"
        overlay="heavy"
        className="min-h-[30vh] flex items-end"
      >
        <div className="max-w-3xl mx-auto px-4 py-10 w-full">
          <h1 className="text-gold font-serif text-3xl sm:text-4xl font-bold mb-2">
            Topic Explorer
          </h1>
          <p className="text-cream/70 text-sm sm:text-base">
            Discover what the Bible teaches about life&apos;s biggest questions
          </p>
        </div>
      </ArtworkBackground>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topics.map(topic => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
