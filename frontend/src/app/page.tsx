'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ArtworkBackground } from '@/components/ui/ArtworkBackground';
import { api } from '@/lib/api';
import type { Verse } from '@/types/bible';

export default function HomePage() {
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);

  useEffect(() => {
    // Fetch a "verse of the day" — use a deterministic selection based on date
    async function fetchDailyVerse() {
      try {
        // Use the day of year to pick a Psalm verse (Psalms has 2461 verses)
        const dayOfYear = Math.floor(
          (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
        );
        const chapter = (dayOfYear % 150) + 1;
        const data = await api.get<{ verses: Verse[] }>(
          `/bible/Psalms/${chapter}?translation=KJV`
        );
        if (data.verses.length > 0) {
          const verseIdx = dayOfYear % data.verses.length;
          setDailyVerse(data.verses[verseIdx]);
        }
      } catch {
        // Fallback verse
        setDailyVerse({
          book: 'Psalms',
          chapter: 119,
          verse: 105,
          text: 'Thy word is a lamp unto my feet, and a light unto my path.',
          translation: 'KJV',
        });
      }
    }
    fetchDailyVerse();
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

          {/* Daily Verse Card */}
          {dailyVerse && (
            <Link href="/chat" className="block">
              <div className="bg-dark-surface/80 backdrop-blur-md border border-gold/20 rounded-2xl p-6 text-left hover:border-gold/40 transition-colors">
                <p className="text-gold text-xs font-medium tracking-wider uppercase mb-3">
                  Daily Spark
                </p>
                <blockquote className="font-serif text-cream text-lg sm:text-xl leading-relaxed mb-3">
                  &ldquo;{dailyVerse.text}&rdquo;
                </blockquote>
                <p className="text-gold/80 text-sm font-medium">
                  {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
                </p>
                <p className="text-dark-muted text-xs mt-3">
                  Tap to discuss this verse with AI
                </p>
              </div>
            </Link>
          )}
        </div>
      </ArtworkBackground>

      {/* Quick access */}
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
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
      </div>

      <BottomNav />
    </div>
  );
}
