'use client';

import Link from 'next/link';
import { cn, getBookSlug } from '@/lib/utils';

interface ChapterGridProps {
  bookName: string;
  chapterCount: number;
  completedChapters?: number[];
}

export function ChapterGrid({ bookName, chapterCount, completedChapters = [] }: ChapterGridProps) {
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
      {chapters.map(chapter => {
        const isCompleted = completedChapters.includes(chapter);
        return (
          <Link
            key={chapter}
            href={`/read/${getBookSlug(bookName)}/${chapter}`}
            className={cn(
              'aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200',
              isCompleted
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-dark-card border border-dark-border text-dark-text hover:border-gold/40 hover:bg-dark-surface'
            )}
          >
            {chapter}
          </Link>
        );
      })}
    </div>
  );
}
