'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
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

      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-2">Topic Explorer</h1>
        <p className="text-dark-muted text-sm mb-6">
          Discover what the Bible teaches about life&apos;s biggest questions
        </p>

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
