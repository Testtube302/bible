'use client';

import { cn } from '@/lib/utils';
import type { Verse } from '@/types/bible';

interface VerseItemProps {
  verse: Verse;
  highlightColor?: string;
  isBookmarked: boolean;
  onTap: () => void;
}

export function VerseItem({ verse, highlightColor, isBookmarked, onTap }: VerseItemProps) {
  return (
    <span
      onClick={onTap}
      className={cn(
        'inline cursor-pointer rounded-sm transition-colors duration-200 hover:bg-dark-card/50',
        highlightColor && `highlight-${highlightColor}`,
        isBookmarked && 'border-l-2 border-gold pl-1'
      )}
    >
      <sup className="verse-number">{verse.verse}</sup>
      {verse.text}{' '}
    </span>
  );
}
