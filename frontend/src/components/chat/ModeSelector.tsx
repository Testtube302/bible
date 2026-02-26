'use client';

import { cn } from '@/lib/utils';
import { CHAT_MODES, type ChatMode } from '@/lib/constants';

interface ModeSelectorProps {
  current: ChatMode;
  onChange: (mode: ChatMode) => void;
}

export function ModeSelector({ current, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-1 bg-dark-card rounded-lg border border-dark-border p-1">
      {CHAT_MODES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200',
            current === value
              ? 'bg-gold text-dark-bg'
              : 'text-dark-muted hover:text-dark-text hover:bg-dark-surface'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
