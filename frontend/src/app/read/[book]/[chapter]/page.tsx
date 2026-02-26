'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { VerseList } from '@/components/bible/VerseList';
import { TranslationToggle } from '@/components/bible/TranslationToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useBible } from '@/hooks/useBible';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useHighlights } from '@/hooks/useHighlights';
import { decodeBookSlug, getBookSlug } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Verse } from '@/types/bible';
import type { Translation } from '@/lib/constants';

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.book as string;
  const chapterNum = parseInt(params.chapter as string, 10);
  const bookName = decodeBookSlug(bookSlug);

  const { translation, setTranslation } = useBible();
  const { bookmarks, fetchBookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { highlights, fetchChapterHighlights, addHighlight } = useHighlights();

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterCount, setChapterCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [chapterData, bookData] = await Promise.all([
          api.get<{ verses: Verse[] }>(
            `/bible/${encodeURIComponent(bookName)}/${chapterNum}?translation=${translation}`
          ),
          api.get<{ book: { chapterCount: number } }>(`/bible/${encodeURIComponent(bookName)}`),
        ]);
        setVerses(chapterData.verses);
        setChapterCount(bookData.book.chapterCount);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    fetchBookmarks();
    fetchChapterHighlights(bookName, chapterNum);
  }, [bookName, chapterNum, translation, fetchBookmarks, fetchChapterHighlights]);

  // Mark chapter as read
  useEffect(() => {
    if (verses.length > 0) {
      api.put(`/progress/${encodeURIComponent(bookName)}/${chapterNum}`, {
        completed: true,
        last_verse_read: verses[verses.length - 1].verse,
      }).catch(() => {});
    }
  }, [verses, bookName, chapterNum]);

  const bookmarkedVerses = new Set(
    bookmarks.filter(b => b.bookName === bookName && b.chapter === chapterNum).map(b => b.verse)
  );

  const handleBookmark = async (verse: number) => {
    if (isBookmarked(bookName, chapterNum, verse)) {
      const bm = bookmarks.find(b => b.bookName === bookName && b.chapter === chapterNum && b.verse === verse);
      if (bm) await removeBookmark(bm.id);
    } else {
      await addBookmark(bookName, chapterNum, verse, translation);
    }
  };

  const handleHighlight = async (verse: number, color: string) => {
    await addHighlight(bookName, chapterNum, verse, verse, translation, color);
  };

  const handleAskAI = (verse: Verse) => {
    const query = encodeURIComponent(`Explain ${verse.book} ${verse.chapter}:${verse.verse}`);
    router.push(`/chat?q=${query}&book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verse}`);
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb + controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/read" className="text-dark-muted hover:text-gold transition-colors">
              Bible
            </Link>
            <span className="text-dark-border">/</span>
            <Link
              href={`/read/${getBookSlug(bookName)}`}
              className="text-dark-muted hover:text-gold transition-colors"
            >
              {bookName}
            </Link>
            <span className="text-dark-border">/</span>
            <span className="text-dark-text">{chapterNum}</span>
          </div>
          <TranslationToggle current={translation} onChange={setTranslation} />
        </div>

        {/* Chapter title */}
        <h1 className="text-gold font-serif text-xl font-bold mb-6">
          {bookName} {chapterNum}
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <VerseList
            verses={verses}
            highlights={highlights}
            bookmarkedVerses={bookmarkedVerses}
            onBookmark={handleBookmark}
            onHighlight={handleHighlight}
            onAskAI={handleAskAI}
          />
        )}

        {/* Chapter navigation */}
        {!loading && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-dark-border">
            {chapterNum > 1 ? (
              <Link href={`/read/${getBookSlug(bookName)}/${chapterNum - 1}`}>
                <Button variant="secondary" size="sm">Previous</Button>
              </Link>
            ) : <div />}
            {chapterNum < chapterCount ? (
              <Link href={`/read/${getBookSlug(bookName)}/${chapterNum + 1}`}>
                <Button variant="secondary" size="sm">Next</Button>
              </Link>
            ) : <div />}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
