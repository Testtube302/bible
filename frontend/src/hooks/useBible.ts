'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { BibleBook, Verse } from '@/types/bible';
import type { Translation } from '@/lib/constants';

export function useBible() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState<Translation>('KJV');

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ books: BibleBook[] }>('/bible/books');
      setBooks(data.books);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChapter = useCallback(async (
    book: string,
    chapter: number,
    trans?: Translation
  ): Promise<Verse[]> => {
    const t = trans ?? translation;
    const data = await api.get<{ verses: Verse[] }>(
      `/bible/${encodeURIComponent(book)}/${chapter}?translation=${t}`
    );
    return data.verses;
  }, [translation]);

  const fetchVerse = useCallback(async (
    book: string,
    chapter: number,
    verse: number
  ): Promise<Record<string, string>> => {
    const data = await api.get<{ translations: Record<string, string> }>(
      `/bible/${encodeURIComponent(book)}/${chapter}/${verse}`
    );
    return data.translations;
  }, []);

  return {
    books,
    loading,
    translation,
    setTranslation,
    fetchBooks,
    fetchChapter,
    fetchVerse,
  };
}
