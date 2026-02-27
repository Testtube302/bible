'use client';

interface DevotionalSectionProps {
  content: string;
}

export function DevotionalSection({ content }: DevotionalSectionProps) {
  return (
    <div className="bg-dark-card border border-gold/20 rounded-xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
        <span className="text-gold text-xs font-medium tracking-wider uppercase">
          Devotional
        </span>
      </div>
      <div className="font-serif text-cream/90 text-sm leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}
