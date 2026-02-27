'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Bookmark } from '@/types/user';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ bookmarks: Bookmark[] }>('/bookmarks');
      setBookmarks(data.bookmarks);
    } catch (err: any) {
      if (err.message?.includes('401')) {
        setBookmarks([]);
      } else {
        console.error('Failed to fetch bookmarks:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = useCallback(async (
    bookName: string,
    chapter: number,
    verse: number,
    translation: string = 'KJV',
    note?: string
  ) => {
    const data = await api.post<{ bookmark: Bookmark }>('/bookmarks', {
      book_name: bookName,
      chapter,
      verse,
      translation,
      note,
    });
    setBookmarks(prev => [data.bookmark, ...prev]);
    return data.bookmark;
  }, []);

  const removeBookmark = useCallback(async (id: string) => {
    await api.delete(`/bookmarks/${id}`);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const isBookmarked = useCallback((bookName: string, chapter: number, verse: number) => {
    return bookmarks.some(b => b.bookName === bookName && b.chapter === chapter && b.verse === verse);
  }, [bookmarks]);

  return { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark, isBookmarked };
}
