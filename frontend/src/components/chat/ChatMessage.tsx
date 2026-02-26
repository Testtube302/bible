'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { cn, getBookSlug } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/** Parse "John 3:16" or "1 Corinthians 13:4-7" into a reading link */
function verseLink(ref: string): string | null {
  const m = ref.match(/^(.+?)\s+(\d+):\d+/);
  if (!m) return null;
  return `/read/${getBookSlug(m[1])}/${m[2]}`;
}
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-gold text-sm font-serif">S</span>
        </div>
      )}

      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gold/15 border border-gold/20 text-dark-text'
            : 'bg-dark-card border border-dark-border text-dark-text'
        )}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : message.isStreaming && !message.content ? (
          <div className="flex items-center gap-2 py-1">
            <LoadingSpinner size="sm" />
            <span className="text-dark-muted text-sm">Searching Scripture...</span>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-strong:text-gold prose-blockquote:border-gold/40 prose-blockquote:text-dark-text/80">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-dark-border">
            <p className="text-[10px] text-dark-muted mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((s, i) => {
                const href = verseLink(s);
                return href ? (
                  <Link key={i} href={href} className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded hover:bg-gold/25 transition-colors">
                    {s}
                  </Link>
                ) : (
                  <span key={i} className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded">
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
