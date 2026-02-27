'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { NotebookEntry } from '@/types/user';

export function useNotebook() {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ entries: NotebookEntry[] }>('/notebook');
      setEntries(data.entries);
    } catch (err: any) {
      if (err.message?.includes('401')) {
        setEntries([]);
      } else {
        console.error('Failed to fetch notebook entries:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback(async (
    bookName: string,
    chapter: number,
    verse: number,
    verseText: string,
    translation: string = 'KJV',
    notes: string = ''
  ) => {
    const data = await api.post<{ entry: NotebookEntry }>('/notebook', {
      book_name: bookName,
      chapter,
      verse,
      verse_text: verseText,
      translation,
      notes,
    });
    setEntries(prev => {
      const existing = prev.findIndex(e => e.id === data.entry.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = data.entry;
        return updated;
      }
      return [data.entry, ...prev];
    });
    return data.entry;
  }, []);

  const updateNotes = useCallback(async (id: string, notes: string) => {
    const data = await api.put<{ entry: NotebookEntry }>(`/notebook/${id}`, { notes });
    setEntries(prev => prev.map(e => e.id === id ? data.entry : e));
    return data.entry;
  }, []);

  const removeEntry = useCallback(async (id: string) => {
    await api.delete(`/notebook/${id}`);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  return { entries, loading, fetchEntries, addEntry, updateNotes, removeEntry };
}
