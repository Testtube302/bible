'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BookGrid } from '@/components/bible/BookGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useBible } from '@/hooks/useBible';

export default function BiblePage() {
  const { books, loading, fetchBooks } = useBible();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-6">The Bible</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <BookGrid books={books} />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
