'use client';

interface PrayerSectionProps {
  content: string;
}

export function PrayerSection({ content }: PrayerSectionProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
        <span className="text-gold/80 text-xs font-medium tracking-wider uppercase">
          Prayer
        </span>
      </div>
      <div className="border-l-2 border-gold/20 pl-4">
        <p className="font-serif text-cream/80 text-sm leading-relaxed italic whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
}
