'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { VerseList } from '@/components/bible/VerseList';
import { TranslationToggle } from '@/components/bible/TranslationToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { QuestionCard } from '@/components/quest/QuestionCard';
import { XPPopup } from '@/components/quest/XPPopup';
import { useBible } from '@/hooks/useBible';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useHighlights } from '@/hooks/useHighlights';
import { useNotebook } from '@/hooks/useNotebook';
import { useQuestions } from '@/hooks/useQuest';
import { decodeBookSlug, getBookSlug } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Verse } from '@/types/bible';
import type { Translation } from '@/lib/constants';

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookSlug = params.book as string;
  const chapterNum = parseInt(params.chapter as string, 10);
  const bookName = decodeBookSlug(bookSlug);
  const targetVerseParam = searchParams.get('verse');
  const [targetVerse, setTargetVerse] = useState<number | undefined>(
    targetVerseParam ? parseInt(targetVerseParam, 10) : undefined
  );

  const { translation, setTranslation } = useBible();
  const { bookmarks, fetchBookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { highlights, fetchChapterHighlights, addHighlight } = useHighlights();
  const { addEntry: addNotebookEntry } = useNotebook();
  const { questions, loading: questionsLoading, error: questionsError, fetchQuestions, submitAnswer } = useQuestions();

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterCount, setChapterCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [xpPopup, setXpPopup] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setShowQuiz(false);
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

  // Scroll to target verse
  useEffect(() => {
    if (targetVerse && verses.length > 0) {
      const el = document.getElementById(`verse-${targetVerse}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
      const timer = setTimeout(() => setTargetVerse(undefined), 2000);
      return () => clearTimeout(timer);
    }
  }, [targetVerse, verses]);

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

  const handleAddToNotebook = async (verse: Verse) => {
    try {
      await addNotebookEntry(bookName, verse.chapter, verse.verse, verse.text, translation);
    } catch (err) {
      console.error('Failed to add to notebook:', err);
    }
  };

  const handleAskAI = (verse: Verse) => {
    const query = encodeURIComponent(`Explain ${verse.book} ${verse.chapter}:${verse.verse}`);
    router.push(`/chat?q=${query}&book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verse}`);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    fetchQuestions(bookName, chapterNum);
  };

  const handleAnswer = useCallback(async (questionIndex: number, answer: number) => {
    const result = await submitAnswer(bookName, chapterNum, questionIndex, answer);
    if (result?.xpAwarded) {
      setXpPopup(result.xpAwarded);
    }
    return result;
  }, [bookName, chapterNum, submitAnswer]);

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      {xpPopup !== null && (
        <XPPopup amount={xpPopup} onDone={() => setXpPopup(null)} />
      )}

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
            targetVerse={targetVerse}
            onBookmark={handleBookmark}
            onHighlight={handleHighlight}
            onAddToNotebook={handleAddToNotebook}
            onAskAI={handleAskAI}
          />
        )}

        {/* Quiz section */}
        {!loading && !showQuiz && (
          <div className="mt-6 text-center">
            <Button variant="secondary" size="sm" onClick={handleStartQuiz}>
              Test Your Understanding
            </Button>
          </div>
        )}

        {showQuiz && (
          <div className="mt-8 pt-6 border-t border-dark-border">
            <h2 className="text-gold font-serif text-lg font-semibold mb-4">
              Test Your Understanding
            </h2>
            {questionsLoading ? (
              <div className="flex flex-col items-center py-8 gap-3">
                <LoadingSpinner size="md" />
                <p className="text-dark-muted text-sm">Generating questions...</p>
                <p className="text-dark-muted text-xs">First time may take up to a minute</p>
              </div>
            ) : questionsError ? (
              <div className="text-center py-8">
                <p className="text-dark-muted text-sm mb-3">{questionsError}</p>
                <Button variant="secondary" size="sm" onClick={handleStartQuiz}>
                  Try Again
                </Button>
              </div>
            ) : (
              questions.map((q, i) => (
                <QuestionCard
                  key={i}
                  question={q}
                  index={i}
                  onAnswer={handleAnswer}
                />
              ))
            )}
          </div>
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
