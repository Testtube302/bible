'use client';

import Link from 'next/link';
import { cn, getBookSlug } from '@/lib/utils';
import type { BibleBook } from '@/types/bible';

interface BookGridProps {
  books: BibleBook[];
}

export function BookGrid({ books }: BookGridProps) {
  const otBooks = books.filter(b => b.testament === 'OT');
  const ntBooks = books.filter(b => b.testament === 'NT');

  return (
    <div className="space-y-8">
      <BookSection title="Old Testament" books={otBooks} />
      <BookSection title="New Testament" books={ntBooks} />
    </div>
  );
}

function BookSection({ title, books }: { title: string; books: BibleBook[] }) {
  return (
    <div>
      <h2 className="text-gold font-serif text-lg font-semibold mb-4 px-1">{title}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {books.map(book => (
          <Link
            key={book.name}
            href={`/read/${getBookSlug(book.name)}`}
            className={cn(
              'bg-dark-card border border-dark-border rounded-lg p-3 hover:border-gold/40 hover:bg-dark-surface transition-all duration-200',
              'flex flex-col items-center text-center gap-1'
            )}
          >
            <span className="text-dark-text text-sm font-medium leading-tight">{book.name}</span>
            <span className="text-dark-muted text-[10px]">{book.chapterCount} ch</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
