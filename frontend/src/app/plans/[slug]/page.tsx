'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { DayCard } from '@/components/plans/DayCard';
import { DevotionalSection } from '@/components/plans/DevotionalSection';
import { PrayerSection } from '@/components/plans/PrayerSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { usePlan } from '@/hooks/usePlans';
import { api } from '@/lib/api';
import type { Verse } from '@/types/bible';
import type { PlanContent } from '@/types/plan';

export default function PlanDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { plan, loading, generating, fetchPlan, completeDay } = usePlan();
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [passageVerses, setPassageVerses] = useState<Record<string, Verse[]>>({});

  useEffect(() => {
    fetchPlan(slug);
  }, [slug, fetchPlan]);

  // Fetch verses when active day changes
  useEffect(() => {
    if (!plan || activeDay === null) return;

    const reading = plan.readings.find(r => r.day === activeDay);
    if (!reading) return;

    reading.passages.forEach(async (p) => {
      const key = `${p.book}-${p.chapter}-${p.verseStart}-${p.verseEnd}`;
      if (passageVerses[key]) return;

      try {
        const data = await api.get<{ verses: Verse[] }>(
          `/bible/${encodeURIComponent(p.book)}/${p.chapter}?translation=KJV`
        );
        const filtered = data.verses.filter(
          v => v.verse >= p.verseStart && v.verse <= p.verseEnd
        );
        setPassageVerses(prev => ({ ...prev, [key]: filtered }));
      } catch (err) {
        console.error('Failed to fetch verses:', err);
      }
    });
  }, [plan, activeDay, passageVerses]);

  function getContent(type: string, day: number): PlanContent | undefined {
    return plan?.content.find(c => c.contentType === type && c.day === day);
  }

  const handleCompleteDay = async () => {
    if (!plan || activeDay === null) return;
    await completeDay(slug, activeDay);
    // Move to next day or back to overview
    const nextDay = activeDay + 1;
    if (nextDay <= plan.durationDays) {
      setActiveDay(nextDay);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveDay(null);
    }
  };

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

  if (!plan) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-dark-muted">Plan not found</p>
          <Link href="/plans">
            <Button variant="secondary" size="sm" className="mt-4">Back to Plans</Button>
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
          <h2 className="text-gold font-serif text-xl mb-2">Preparing your plan...</h2>
          <p className="text-dark-muted text-sm">
            Generating devotionals for &ldquo;{plan.title}&rdquo;. This may take a minute.
          </p>
        </div>
      </div>
    );
  }

  const completedDays = plan.progress?.completedDays || [];
  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / plan.durationDays) * 100);

  // Day overview mode
  if (activeDay === null) {
    return (
      <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/plans" className="text-dark-muted hover:text-gold transition-colors">
              Plans
            </Link>
            <span className="text-dark-border">/</span>
            <span className="text-dark-text">{plan.title}</span>
          </div>

          {/* Header */}
          <h1 className="text-gold font-serif text-xl font-bold mb-2">{plan.title}</h1>
          <p className="text-dark-muted text-sm mb-4">{plan.description}</p>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-dark-muted text-xs whitespace-nowrap">
              {completedCount}/{plan.durationDays} days
            </span>
          </div>

          {/* Plan complete message */}
          {plan.progress?.completedAt && (
            <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-6 text-center">
              <p className="text-gold font-serif text-lg font-semibold mb-1">Plan Complete!</p>
              <p className="text-dark-muted text-xs">You can revisit any day below.</p>
            </div>
          )}

          {/* Day list */}
          <div className="space-y-2">
            {plan.readings.map(reading => {
              const isCompleted = completedDays.includes(reading.day);
              const currentDay = plan.progress?.currentDay ?? 1;
              const isCurrent = reading.day === currentDay && !plan.progress?.completedAt;

              return (
                <DayCard
                  key={reading.day}
                  reading={reading}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent || isCompleted || !!plan.progress?.completedAt}
                  onClick={() => setActiveDay(reading.day)}
                />
              );
            })}
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Active day reading mode
  const reading = plan.readings.find(r => r.day === activeDay);
  if (!reading) return null;

  const devotional = getContent('devotional', activeDay);
  const prayer = getContent('prayer', activeDay);
  const isDayCompleted = completedDays.includes(activeDay);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/plans" className="text-dark-muted hover:text-gold transition-colors">
            Plans
          </Link>
          <span className="text-dark-border">/</span>
          <button
            onClick={() => setActiveDay(null)}
            className="text-dark-muted hover:text-gold transition-colors"
          >
            {plan.title}
          </button>
          <span className="text-dark-border">/</span>
          <span className="text-dark-text">Day {activeDay}</span>
        </div>

        {/* Day title */}
        <h1 className="text-gold font-serif text-xl font-bold mb-1">
          Day {reading.day}: {reading.title}
        </h1>
        <p className="text-dark-muted text-xs mb-6">
          {reading.passages.map(p => p.label).join(' | ')}
        </p>

        {/* Devotional */}
        {devotional && <DevotionalSection content={devotional.content} />}

        {/* Scripture passages */}
        {reading.passages.map(p => {
          const key = `${p.book}-${p.chapter}-${p.verseStart}-${p.verseEnd}`;
          const verses = passageVerses[key];

          return (
            <div key={key} className="bg-dark-card border border-dark-border rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gold font-serif text-base font-semibold">
                  {p.label}
                </h2>
                <Link
                  href={`/read/${encodeURIComponent(p.book)}/${p.chapter}`}
                  className="text-dark-muted hover:text-gold text-xs transition-colors"
                >
                  Read full chapter
                </Link>
              </div>

              {verses ? (
                <div className="space-y-2">
                  {verses.map(verse => (
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
          );
        })}

        {/* Prayer */}
        {prayer && <PrayerSection content={prayer.content} />}

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-dark-border">
          {activeDay > 1 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setActiveDay(activeDay - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Previous Day
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setActiveDay(null)}>
              Back to Plan
            </Button>
          )}

          {!isDayCompleted ? (
            <Button variant="primary" size="sm" onClick={handleCompleteDay}>
              Mark Day Complete
            </Button>
          ) : activeDay < plan.durationDays ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setActiveDay(activeDay + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Next Day
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-gold text-sm font-medium mb-2">Plan Complete!</p>
              <Button variant="secondary" size="sm" onClick={() => setActiveDay(null)}>
                Back to Plan
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
