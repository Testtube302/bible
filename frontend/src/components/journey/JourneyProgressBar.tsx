'use client';

interface JourneyProgressBarProps {
  current: number;
  total: number;
}

export function JourneyProgressBar({ current, total }: JourneyProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-dark-muted text-xs whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  );
}
