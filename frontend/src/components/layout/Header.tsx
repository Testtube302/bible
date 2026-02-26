'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-gold text-xl font-serif font-bold tracking-wide">Scripture</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/read" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Bible
          </Link>
          <Link href="/chat" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Chat
          </Link>
          <Link href="/artwork" className="text-dark-muted hover:text-dark-text transition-colors text-sm">
            Art
          </Link>
        </nav>
      </div>
    </header>
  );
}
