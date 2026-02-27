'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Highlight } from '@/types/user';

export function useHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChapterHighlights = useCallback(async (bookName: string, chapter: number) => {
    setLoading(true);
    try {
      const data = await api.get<{ highlights: Highlight[] }>(
        `/highlights/${encodeURIComponent(bookName)}/${chapter}`
      );
      setHighlights(data.highlights);
    } catch (err: any) {
      if (err.message?.includes('401')) {
        setHighlights([]);
      } else {
        console.error('Failed to fetch highlights:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addHighlight = useCallback(async (
    bookName: string,
    chapter: number,
    verseStart: number,
    verseEnd: number,
    translation: string = 'KJV',
    color: string = 'gold'
  ) => {
    const data = await api.post<{ highlight: Highlight }>('/highlights', {
      book_name: bookName,
      chapter,
      verse_start: verseStart,
      verse_end: verseEnd,
      translation,
      color,
    });
    setHighlights(prev => [...prev, data.highlight]);
    return data.highlight;
  }, []);

  const removeHighlight = useCallback(async (id: string) => {
    await api.delete(`/highlights/${id}`);
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);

  const getVerseHighlight = useCallback((verse: number): Highlight | undefined => {
    return highlights.find(h => verse >= h.verseStart && verse <= h.verseEnd);
  }, [highlights]);

  return { highlights, loading, fetchChapterHighlights, addHighlight, removeHighlight, getVerseHighlight };
}
