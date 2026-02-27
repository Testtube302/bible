'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useBookmarks } from '@/hooks/useBookmarks';
import { getBookSlug } from '@/lib/utils';
import type { Bookmark } from '@/types/user';

export default function BookmarksPage() {
  const { bookmarks, loading, fetchBookmarks, removeBookmark } = useBookmarks();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const grouped = bookmarks.reduce<Record<string, Bookmark[]>>((acc, bm) => {
    if (!acc[bm.bookName]) acc[bm.bookName] = [];
    acc[bm.bookName].push(bm);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-6">Bookmarks</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-muted text-lg mb-2">No bookmarks yet</p>
            <p className="text-dark-muted text-sm">
              Tap any verse while reading to bookmark it.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([bookName, bms]) => (
              <div key={bookName}>
                <h2 className="text-gold-dim font-serif text-lg font-semibold mb-3">{bookName}</h2>
                <div className="space-y-2">
                  {bms.map(bm => (
                    <div
                      key={bm.id}
                      className="bg-dark-card border border-dark-border rounded-lg p-4 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/read/${getBookSlug(bm.bookName)}/${bm.chapter}?verse=${bm.verse}`}
                          className="text-gold hover:text-gold-light transition-colors text-sm font-medium"
                        >
                          {bm.bookName} {bm.chapter}:{bm.verse}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-dark-border/50 text-dark-muted px-1.5 py-0.5 rounded">
                            {bm.translation}
                          </span>
                          <span className="text-dark-muted text-xs">
                            {new Date(bm.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {bm.note && (
                          <p className="text-dark-muted text-xs mt-2 italic">{bm.note}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeBookmark(bm.id)}
                        className="text-dark-muted hover:text-burgundy-light transition-colors p-1 shrink-0"
                        title="Remove bookmark"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
