'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseBibleReference, getMatchingBooks } from '@/lib/bible-ref-parser';
import { getBookSlug } from '@/lib/utils';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = query ? parseBibleReference(query) : null;
  const matchingBooks = query.length >= 1 ? getMatchingBooks(query) : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function navigateToRef(ref: ReturnType<typeof parseBibleReference>) {
    if (!ref) return;
    const slug = getBookSlug(ref.bookName);
    if (ref.type === 'verse' && ref.chapter && ref.verse) {
      router.push(`/read/${slug}/${ref.chapter}?verse=${ref.verse}`);
    } else if (ref.type === 'chapter' && ref.chapter) {
      router.push(`/read/${slug}/${ref.chapter}`);
    } else {
      router.push(`/read/${slug}`);
    }
    setQuery('');
    setShowDropdown(false);
  }

  function navigateToBook(bookName: string) {
    router.push(`/read/${getBookSlug(bookName)}`);
    setQuery('');
    setShowDropdown(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (parsed) {
      navigateToRef(parsed);
    } else if (matchingBooks.length > 0) {
      navigateToBook(matchingBooks[0]);
    } else if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowDropdown(false);
    }
  }

  function getRefLabel(ref: NonNullable<typeof parsed>): string {
    if (ref.type === 'verse') return `${ref.bookName} ${ref.chapter}:${ref.verse}`;
    if (ref.type === 'chapter') return `${ref.bookName} ${ref.chapter}`;
    return ref.bookName;
  }

  const hasResults = parsed || matchingBooks.length > 0;

  return (
    <div ref={containerRef} className="relative w-full mb-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search (e.g. John 3:16, Romans, Psalms 23)..."
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>
      </form>

      {showDropdown && hasResults && query.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50 overflow-hidden">
          {parsed && (
            <button
              onClick={() => navigateToRef(parsed)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-left"
            >
              <svg className="w-4 h-4 text-gold shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
              <span className="text-sm text-dark-text">
                Go to <span className="text-gold font-medium">{getRefLabel(parsed)}</span>
              </span>
            </button>
          )}

          {matchingBooks
            .filter(book => !parsed || book !== parsed.bookName)
            .map(book => (
              <button
                key={book}
                onClick={() => navigateToBook(book)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-card transition-colors text-left"
              >
                <svg className="w-4 h-4 text-dark-muted shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="text-sm text-dark-muted">{book}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
