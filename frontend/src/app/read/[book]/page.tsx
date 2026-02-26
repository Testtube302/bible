'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ChapterGrid } from '@/components/bible/ChapterGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { decodeBookSlug } from '@/lib/utils';
import { api } from '@/lib/api';
import type { BibleBook } from '@/types/bible';

export default function BookPage() {
  const params = useParams();
  const bookSlug = params.book as string;
  const bookName = decodeBookSlug(bookSlug);

  const [book, setBook] = useState<BibleBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await api.get<{ book: BibleBook }>(`/bible/${encodeURIComponent(bookName)}`);
        setBook(data.book);
      } catch (err) {
        console.error('Failed to fetch book:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [bookName]);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/read" className="text-dark-muted hover:text-gold transition-colors">
            Bible
          </Link>
          <span className="text-dark-border">/</span>
          <span className="text-dark-text">{bookName}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : book ? (
          <>
            <div className="mb-6">
              <h1 className="text-gold font-serif text-2xl font-bold">{book.name}</h1>
              <p className="text-dark-muted text-sm mt-1">
                {book.testament === 'OT' ? 'Old Testament' : 'New Testament'} &middot; {book.chapterCount} chapters &middot; {book.verseCount} verses
              </p>
            </div>

            <ChapterGrid bookName={book.name} chapterCount={book.chapterCount} />
          </>
        ) : (
          <p className="text-dark-muted text-center py-20">Book not found</p>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
