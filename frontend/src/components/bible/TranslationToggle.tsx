'use client';

import { cn } from '@/lib/utils';
import { TRANSLATIONS, type Translation } from '@/lib/constants';

interface TranslationToggleProps {
  current: Translation;
  onChange: (translation: Translation) => void;
}

export function TranslationToggle({ current, onChange }: TranslationToggleProps) {
  return (
    <div className="inline-flex bg-dark-card rounded-lg border border-dark-border p-0.5">
      {TRANSLATIONS.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
            current === t
              ? 'bg-gold text-dark-bg'
              : 'text-dark-muted hover:text-dark-text'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
