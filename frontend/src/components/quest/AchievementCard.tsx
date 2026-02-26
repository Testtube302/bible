'use client';

import { cn } from '@/lib/utils';
import type { Achievement } from '@/types/quest';

const ICON_MAP: Record<string, string> = {
  footprints: '\u{1F463}',
  book: '\u{1F4D6}',
  scroll: '\u{1F4DC}',
  graduation: '\u{1F393}',
  star: '\u{2B50}',
  music: '\u{1F3B5}',
  cross: '\u{271D}\u{FE0F}',
  flame: '\u{1F525}',
  compass: '\u{1F9ED}',
  lightbulb: '\u{1F4A1}',
  brain: '\u{1F9E0}',
  trophy: '\u{1F3C6}',
  map: '\u{1F5FA}\u{FE0F}',
  globe: '\u{1F30D}',
};

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const emoji = ICON_MAP[achievement.icon] ?? '\u{2B50}';

  return (
    <div
      className={cn(
        'bg-dark-card border rounded-xl p-4 transition-colors',
        achievement.unlocked
          ? 'border-gold/30'
          : 'border-dark-border opacity-50'
      )}
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <h3 className={cn(
        'text-sm font-semibold mb-1',
        achievement.unlocked ? 'text-gold' : 'text-dark-muted'
      )}>
        {achievement.title}
      </h3>
      <p className="text-dark-muted text-xs leading-relaxed">
        {achievement.description}
      </p>
      <p className="text-gold/60 text-[10px] mt-2">+{achievement.xpReward} XP</p>
    </div>
  );
}
