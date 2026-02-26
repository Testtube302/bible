'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useTopic } from '@/hooks/useTopics';

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params.topic as string;
  const { topic, loading, fetchTopic } = useTopic();

  useEffect(() => {
    fetchTopic(slug);
  }, [slug, fetchTopic]);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/topics" className="text-dark-muted hover:text-gold transition-colors">
            Topics
          </Link>
          <span className="text-dark-border">/</span>
          <span className="text-dark-text">{topic?.label ?? slug}</span>
        </div>

        {loading || !topic ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-dark-muted text-sm">Exploring what Scripture says...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-gold font-serif text-2xl font-bold mb-1">{topic.label}</h1>
              <p className="text-dark-muted text-sm">{topic.description}</p>
            </div>

            {/* AI Summary */}
            <div className="bg-dark-card border border-gold/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-gold text-xs font-medium tracking-wider uppercase">
                  AI Summary
                </span>
              </div>
              <div className="font-serif text-cream/90 text-sm leading-relaxed whitespace-pre-line">
                {topic.summary}
              </div>
            </div>

            {/* Related Verses */}
            <div>
              <h2 className="text-dark-text font-serif text-lg font-semibold mb-3">
                Key Verses
              </h2>
              <div className="space-y-3">
                {topic.verses.slice(0, 10).map((v, i) => (
                  <Link
                    key={i}
                    href={`/read/${encodeURIComponent(v.book)}/${v.chapter}`}
                  >
                    <div className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-gold/30 transition-colors">
                      <p className="text-gold text-xs font-medium mb-1">
                        {v.book} {v.chapter}:{v.verse}
                      </p>
                      <p className="font-serif text-dark-text text-sm leading-relaxed">
                        &ldquo;{v.text}&rdquo;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <Link href="/topics">
                <Button variant="secondary" size="sm">Explore More Topics</Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
