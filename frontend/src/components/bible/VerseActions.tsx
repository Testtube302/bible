'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { HIGHLIGHT_COLORS } from '@/lib/constants';
import type { Verse } from '@/types/bible';

interface VerseActionsProps {
  verse: Verse;
  isBookmarked: boolean;
  onClose: () => void;
  onBookmark: () => void;
  onHighlight: (color: string) => void;
  onAskAI: () => void;
}

export function VerseActions({
  verse,
  isBookmarked,
  onClose,
  onBookmark,
  onHighlight,
  onAskAI,
}: VerseActionsProps) {
  return (
    <Modal isOpen onClose={onClose}>
      <div className="space-y-4">
        {/* Verse preview */}
        <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
          <p className="text-gold text-xs font-medium mb-1">
            {verse.book} {verse.chapter}:{verse.verse}
          </p>
          <p className="font-serif text-dark-text text-sm leading-relaxed">
            &ldquo;{verse.text}&rdquo;
          </p>
        </div>

        {/* Highlight colors */}
        <div>
          <p className="text-dark-muted text-xs mb-2">Highlight</p>
          <div className="flex gap-2">
            {HIGHLIGHT_COLORS.map(({ name, label }) => (
              <button
                key={name}
                onClick={() => onHighlight(name)}
                className={`w-8 h-8 rounded-full highlight-${name} border-2 border-dark-border hover:border-gold transition-colors`}
                title={label}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={onBookmark} className="w-full justify-start gap-2">
            {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
          </Button>
          <Button variant="primary" onClick={onAskAI} className="w-full justify-start gap-2">
            Ask AI about this verse
          </Button>
        </div>
      </div>
    </Modal>
  );
}
