'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { JourneyIntro } from '@/components/journey/JourneyIntro';
import { JourneyTransition } from '@/components/journey/JourneyTransition';
import { JourneyReflection } from '@/components/journey/JourneyReflection';
import { JourneyProgressBar } from '@/components/journey/JourneyProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useJourney } from '@/hooks/useJourney';
import { api } from '@/lib/api';
import type { Verse } from '@/types/bible';
import type { JourneyContent } from '@/types/journey';

export default function JourneyReaderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { journey, loading, generating, fetchJourney, updateProgress } = useJourney();
  const [passageVerses, setPassageVerses] = useState<Record<number, Verse[]>>({});
  const [loadingPassage, setLoadingPassage] = useState<number | null>(null);

  useEffect(() => {
    fetchJourney(slug);
  }, [slug, fetchJourney]);

  // Fetch verses for current and adjacent passages
  const currentIdx = journey?.progress?.currentPassage ?? 0;

  useEffect(() => {
    if (!journey) return;

    async function fetchPassageVerses(idx: number) {
      if (passageVerses[idx] || idx < 0 || idx >= journey!.passages.length) return;
      const p = journey!.passages[idx];
      try {
        const data = await api.get<{ verses: Verse[] }>(
          `/bible/${encodeURIComponent(p.book)}/${p.chapter}?translation=KJV`
        );
        // Filter to the verse range
        const filtered = data.verses.filter(
          v => v.verse >= p.verseStart && v.verse <= p.verseEnd
        );
        setPassageVerses(prev => ({ ...prev, [idx]: filtered }));
      } catch (err) {
        console.error('Failed to fetch passage verses:', err);
      }
    }

    // Prefetch current and next
    fetchPassageVerses(currentIdx);
    fetchPassageVerses(currentIdx + 1);
  }, [journey, currentIdx, passageVerses]);

  const handleNext = async () => {
    if (!journey) return;
    const nextIdx = currentIdx + 1;
    if (nextIdx >= journey.passages.length) return;
    setLoadingPassage(nextIdx);
    await updateProgress(slug, nextIdx);
    setLoadingPassage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = async () => {
    if (!journey || currentIdx <= 0) return;
    await updateProgress(slug, currentIdx - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function getContent(type: string, position: number): JourneyContent | undefined {
    return journey?.content.find(c => c.contentType === type && c.position === position);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-dark-muted">Journey not found</p>
          <Link href="/journeys">
            <Button variant="secondary" size="sm" className="mt-4">Back to Journeys</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-gold font-serif text-xl mb-2">Preparing your journey...</h2>
          <p className="text-dark-muted text-sm">
            Generating AI commentary for &ldquo;{journey.title}&rdquo;. This may take a minute.
          </p>
        </div>
      </div>
    );
  }

  const currentPassage = journey.passages[currentIdx];
  const currentVerses = passageVerses[currentIdx] ?? [];
  const intro = getContent('introduction', 0);
  const transition = getContent('transition', currentIdx - 1);
  const reflection = getContent('reflection', currentIdx);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/journeys" className="text-dark-muted hover:text-gold transition-colors">
            Journeys
          </Link>
          <span className="text-dark-border">/</span>
          <span className="text-dark-text">{journey.title}</span>
        </div>

        {/* Title and progress */}
        <h1 className="text-gold font-serif text-xl font-bold mb-2">{journey.title}</h1>
        <div className="mb-6">
          <JourneyProgressBar current={currentIdx + 1} total={journey.passages.length} />
        </div>

        {/* Introduction (show on first passage) */}
        {currentIdx === 0 && intro && (
          <JourneyIntro content={intro.content} />
        )}

        {/* Transition (show between passages) */}
        {currentIdx > 0 && transition && (
          <JourneyTransition content={transition.content} />
        )}

        {/* Current passage */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gold font-serif text-base font-semibold">
              {currentPassage.label}
            </h2>
            <Link
              href={`/read/${encodeURIComponent(currentPassage.book)}/${currentPassage.chapter}`}
              className="text-dark-muted hover:text-gold text-xs transition-colors"
            >
              {currentPassage.book} {currentPassage.chapter}:{currentPassage.verseStart}
              {currentPassage.verseEnd !== currentPassage.verseStart && `-${currentPassage.verseEnd}`}
            </Link>
          </div>

          {currentVerses.length > 0 ? (
            <div className="space-y-2">
              {currentVerses.map(verse => (
                <p key={verse.verse} className="font-serif text-dark-text text-sm leading-relaxed">
                  <sup className="text-gold/60 text-[10px] mr-1">{verse.verse}</sup>
                  {verse.text}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {/* Reflection */}
        {reflection && <JourneyReflection content={reflection.content} />}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-dark-border">
          {currentIdx > 0 ? (
            <Button variant="secondary" size="sm" onClick={handlePrev}>
              Previous
            </Button>
          ) : <div />}
          {currentIdx < journey.passages.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={loadingPassage !== null}
            >
              {loadingPassage !== null ? 'Loading...' : 'Next Passage'}
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-gold text-sm font-medium mb-2">Journey Complete!</p>
              <Link href="/journeys">
                <Button variant="secondary" size="sm">Back to Journeys</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
