'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-gold text-xl font-serif font-bold tracking-wide">Scripture</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5">
          <Link href="/read" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Bible
          </Link>
          <Link href="/journeys" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Journeys
          </Link>
          <Link href="/plans" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Plans
          </Link>
          <Link href="/chat" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Chat
          </Link>
          <Link href="/topics" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Topics
          </Link>
          <Link href="/timeline" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Timeline
          </Link>
          <Link href="/quest" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Quest
          </Link>
          <Link href="/artwork" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Art
          </Link>
          <Link href="/bookmarks" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Bookmarks
          </Link>
          <Link href="/notebook" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Notebook
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-2 pl-2 border-l border-dark-border">
              <span className="text-dark-muted text-xs">{user?.displayName}</span>
              <button
                onClick={logout}
                className="text-dark-muted hover:text-dark-text transition-colors text-xs"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gold hover:text-gold-light transition-colors text-sm ml-2 pl-2 border-l border-dark-border"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
