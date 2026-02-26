'use client';

import { useState } from 'react';
import { VerseItem } from './VerseItem';
import { VerseActions } from './VerseActions';
import type { Verse } from '@/types/bible';
import type { Highlight } from '@/types/user';

interface VerseListProps {
  verses: Verse[];
  highlights: Highlight[];
  bookmarkedVerses: Set<number>;
  onBookmark: (verse: number) => void;
  onHighlight: (verse: number, color: string) => void;
  onAskAI: (verse: Verse) => void;
}

export function VerseList({
  verses,
  highlights,
  bookmarkedVerses,
  onBookmark,
  onHighlight,
  onAskAI,
}: VerseListProps) {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  const getHighlightColor = (verseNum: number): string | undefined => {
    const h = highlights.find(hl => verseNum >= hl.verseStart && verseNum <= hl.verseEnd);
    return h?.color;
  };

  return (
    <div className="scripture-text space-y-1 px-1">
      {verses.map(verse => (
        <VerseItem
          key={verse.verse}
          verse={verse}
          highlightColor={getHighlightColor(verse.verse)}
          isBookmarked={bookmarkedVerses.has(verse.verse)}
          onTap={() => setSelectedVerse(verse)}
        />
      ))}

      {selectedVerse && (
        <VerseActions
          verse={selectedVerse}
          isBookmarked={bookmarkedVerses.has(selectedVerse.verse)}
          onClose={() => setSelectedVerse(null)}
          onBookmark={() => {
            onBookmark(selectedVerse.verse);
            setSelectedVerse(null);
          }}
          onHighlight={(color) => {
            onHighlight(selectedVerse.verse, color);
            setSelectedVerse(null);
          }}
          onAskAI={() => {
            onAskAI(selectedVerse);
            setSelectedVerse(null);
          }}
        />
      )}
    </div>
  );
}
