'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { XPBar } from '@/components/quest/XPBar';
import { StreakBadge } from '@/components/quest/StreakBadge';
import { AchievementCard } from '@/components/quest/AchievementCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useQuest } from '@/hooks/useQuest';

export default function QuestPage() {
  const { dashboard, loading, fetchDashboard } = useQuest();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-6">Bible Quest</h1>

        {loading || !dashboard ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* XP and Level */}
            <XPBar
              level={dashboard.level}
              totalXP={dashboard.totalXP}
              xpToNextLevel={dashboard.xpToNextLevel}
            />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
                <StreakBadge streak={dashboard.currentStreak} />
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
                <p className="text-gold text-lg font-bold">{dashboard.chaptersRead}</p>
                <p className="text-dark-muted text-[10px]">Chapters Read</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
                <p className="text-gold text-lg font-bold">
                  {dashboard.questionsAnswered > 0
                    ? Math.round((dashboard.correctAnswers / dashboard.questionsAnswered) * 100)
                    : 0}%
                </p>
                <p className="text-dark-muted text-[10px]">Quiz Accuracy</p>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-dark-text font-serif text-lg font-semibold mb-3">Achievements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dashboard.achievements.map(ach => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
