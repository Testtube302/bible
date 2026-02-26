'use client';

interface JourneyTransitionProps {
  content: string;
}

export function JourneyTransition({ content }: JourneyTransitionProps) {
  return (
    <div className="my-6 px-4 py-4 border-l-2 border-gold/30">
      <span className="text-gold/60 text-[10px] font-medium tracking-wider uppercase mb-2 block">
        AI Commentary
      </span>
      <p className="font-serif text-cream/70 text-sm leading-relaxed italic whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
