'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useNotebook } from '@/hooks/useNotebook';
import { getBookSlug } from '@/lib/utils';
import type { NotebookEntry } from '@/types/user';

function NoteCard({
  entry,
  onSave,
  onDelete,
}: {
  entry: NotebookEntry;
  onSave: (id: string, notes: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(entry.notes);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (value: string) => {
    if (value === entry.notes) return;
    setSaving(true);
    try {
      await onSave(entry.id, value);
    } finally {
      setSaving(false);
    }
  }, [entry.id, entry.notes, onSave]);

  function handleChange(value: string) {
    setNotes(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(value), 1500);
  }

  function handleBlur() {
    if (timerRef.current) clearTimeout(timerRef.current);
    save(notes);
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <Link
            href={`/read/${getBookSlug(entry.bookName)}/${entry.chapter}?verse=${entry.verse}`}
            className="text-gold hover:text-gold-light transition-colors text-sm font-medium"
          >
            {entry.bookName} {entry.chapter}:{entry.verse}
          </Link>
          <span className="text-[10px] bg-dark-border/50 text-dark-muted px-1.5 py-0.5 rounded ml-2">
            {entry.translation}
          </span>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-dark-muted hover:text-burgundy-light transition-colors p-1 shrink-0"
          title="Remove from notebook"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      <p className="font-serif text-dark-text/80 text-sm leading-relaxed italic mb-3">
        &ldquo;{entry.verseText}&rdquo;
      </p>

      <div className="relative">
        <textarea
          value={notes}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="Write your notes..."
          rows={3}
          className="w-full bg-dark-bg/50 border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors resize-y"
        />
        {saving && (
          <span className="absolute top-2 right-2 text-[10px] text-gold animate-pulse">
            Saving...
          </span>
        )}
      </div>
    </div>
  );
}

export default function NotebookPage() {
  const { entries, loading, fetchEntries, updateNotes, removeEntry } = useNotebook();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSave = useCallback(async (id: string, notes: string) => {
    await updateNotes(id, notes);
  }, [updateNotes]);

  const grouped = entries.reduce<Record<string, NotebookEntry[]>>((acc, entry) => {
    if (!acc[entry.bookName]) acc[entry.bookName] = [];
    acc[entry.bookName].push(entry);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-6">Notebook</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-muted text-lg mb-2">Your notebook is empty</p>
            <p className="text-dark-muted text-sm">
              Tap any verse while reading and choose &ldquo;Add to Notebook&rdquo; to save it here with your personal notes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([bookName, bookEntries]) => (
              <div key={bookName}>
                <h2 className="text-gold-dim font-serif text-lg font-semibold mb-3">{bookName}</h2>
                <div className="space-y-3">
                  {bookEntries.map(entry => (
                    <NoteCard
                      key={entry.id}
                      entry={entry}
                      onSave={handleSave}
                      onDelete={removeEntry}
                    />
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
