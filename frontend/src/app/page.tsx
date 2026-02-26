'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ArtworkBackground } from '@/components/ui/ArtworkBackground';
import { SwipeableCard } from '@/components/ui/SwipeableCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';

interface DailySpark {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  contextText: string;
  applicationText: string;
}

interface QuestSummary {
  totalXP: number;
  level: number;
  currentStreak: number;
}

interface JourneySummary {
  slug: string;
  title: string;
  coverImage: string | null;
  progress: { currentPassage: number; completed: boolean } | null;
  passages: { length: number }[];
}

export default function HomePage() {
  const [spark, setSpark] = useState<DailySpark | null>(null);
  const [quest, setQuest] = useState<QuestSummary | null>(null);
  const [journeys, setJourneys] = useState<JourneySummary[]>([]);
  const [sparkLoading, setSparkLoading] = useState(true);

  useEffect(() => {
    // Fetch daily spark
    api.get<DailySpark>('/daily-spark')
      .then(setSpark)
      .catch(() => {
        // Fallback
        setSpark({
          book: 'Psalms', chapter: 119, verse: 105,
          text: 'Thy word is a lamp unto my feet, and a light unto my path.',
          translation: 'KJV', contextText: '', applicationText: '',
        });
      })
      .finally(() => setSparkLoading(false));

    // Fetch quest summary
    api.get<QuestSummary>('/quest/dashboard')
      .then(setQuest)
      .catch(() => {});

    // Fetch journeys for preview
    api.get<{ journeys: JourneySummary[] }>('/journeys')
      .then(data => setJourneys(data.journeys.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      {/* Hero section with artwork */}
      <ArtworkBackground
        src="/bible/artwork/hero-creation-of-adam.webp"
        alt="The Creation of Adam by Michelangelo"
        overlay="medium"
        className="min-h-[60vh] flex items-center"
      >
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-gold font-serif text-4xl sm:text-5xl font-bold mb-4 tracking-wide">
            Scripture
          </h1>
          <p className="text-cream/80 text-sm sm:text-base mb-8">
            Explore the Bible in an immersive, interactive experience
          </p>

          {/* Enhanced Daily Spark */}
          {sparkLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : spark && (
            <div className="bg-dark-surface/80 backdrop-blur-md border border-gold/20 rounded-2xl p-6 text-left">
              <p className="text-gold text-xs font-medium tracking-wider uppercase mb-3">
                Daily Spark
              </p>
              <SwipeableCard>
                {/* Card 1: Verse */}
                <div>
                  <blockquote className="font-serif text-cream text-lg sm:text-xl leading-relaxed mb-3">
                    &ldquo;{spark.text}&rdquo;
                  </blockquote>
                  <p className="text-gold/80 text-sm font-medium">
                    {spark.book} {spark.chapter}:{spark.verse}
                  </p>
                  {spark.contextText && (
                    <p className="text-dark-muted text-xs mt-3">Swipe for context &rarr;</p>
                  )}
                </div>

                {/* Card 2: Context */}
                {spark.contextText && (
                  <div>
                    <p className="text-gold/60 text-[10px] font-medium tracking-wider uppercase mb-2">
                      Historical Context
                    </p>
                    <p className="text-cream/80 text-sm leading-relaxed">
                      {spark.contextText}
                    </p>
                  </div>
                )}

                {/* Card 3: Application */}
                {spark.applicationText && (
                  <div>
                    <p className="text-gold/60 text-[10px] font-medium tracking-wider uppercase mb-2">
                      Today&apos;s Application
                    </p>
                    <p className="text-cream/80 text-sm leading-relaxed">
                      {spark.applicationText}
                    </p>
                  </div>
                )}
              </SwipeableCard>
              <Link href={`/chat?q=${encodeURIComponent(`Explain ${spark.book} ${spark.chapter}:${spark.verse}`)}`} className="block mt-3">
                <p className="text-dark-muted text-xs hover:text-gold transition-colors">
                  Tap to discuss this verse with AI
                </p>
              </Link>
            </div>
          )}
        </div>
      </ArtworkBackground>

      {/* Quick access + new features */}
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {/* Primary actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/read"
            className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-colors"
          >
            <p className="text-gold font-serif text-lg font-semibold mb-1">Read</p>
            <p className="text-dark-muted text-xs">Browse books & chapters</p>
          </Link>
          <Link
            href="/chat"
            className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-colors"
          >
            <p className="text-gold font-serif text-lg font-semibold mb-1">Ask</p>
            <p className="text-dark-muted text-xs">AI Scripture assistant</p>
          </Link>
        </div>

        {/* Story Journeys section */}
        {journeys.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-dark-text font-serif text-lg font-semibold">Story Journeys</h2>
              <Link href="/journeys" className="text-gold text-xs hover:text-gold-light transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {journeys.map((j: any) => (
                <Link
                  key={j.slug}
                  href={`/journeys/${j.slug}`}
                  className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-gold/30 transition-colors"
                >
                  <p className="text-gold font-serif text-sm font-semibold mb-1">{j.title}</p>
                  <p className="text-dark-muted text-[10px]">{j.passages.length} passages</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quest summary */}
        {quest && (
          <Link href="/quest">
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-colors">
              <p className="text-gold text-xs font-medium tracking-wider uppercase mb-3">Bible Quest</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-gold text-lg font-bold">{quest.level}</p>
                    <p className="text-dark-muted text-[10px]">Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-dark-text text-lg font-bold">{quest.totalXP}</p>
                    <p className="text-dark-muted text-[10px]">XP</p>
                  </div>
                </div>
                {quest.currentStreak > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-orange-400">🔥</span>
                    <span className="text-dark-text text-sm font-semibold">{quest.currentStreak}</span>
                    <span className="text-dark-muted text-xs">day streak</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Secondary feature cards */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/topics"
            className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-gold/30 transition-colors text-center"
          >
            <p className="text-gold font-serif text-sm font-semibold mb-1">Topics</p>
            <p className="text-dark-muted text-[10px]">Explore themes</p>
          </Link>
          <Link
            href="/timeline"
            className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-gold/30 transition-colors text-center"
          >
            <p className="text-gold font-serif text-sm font-semibold mb-1">Timeline</p>
            <p className="text-dark-muted text-[10px]">Bible history</p>
          </Link>
          <Link
            href="/artwork"
            className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-gold/30 transition-colors text-center"
          >
            <p className="text-gold font-serif text-sm font-semibold mb-1">Art</p>
            <p className="text-dark-muted text-[10px]">Sacred gallery</p>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
