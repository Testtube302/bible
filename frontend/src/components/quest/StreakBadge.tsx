'use client';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 bg-dark-card border border-dark-border rounded-lg px-3 py-2">
      <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 23c-3.866 0-7-2.686-7-6 0-1.665.585-3.193 1.56-4.39L12 5l5.44 7.61A7.262 7.262 0 0 1 19 17c0 3.314-3.134 6-7 6Zm0-2c2.761 0 5-1.79 5-4 0-1.035-.382-2.022-1.03-2.86L12 9.2l-3.97 4.94A4.84 4.84 0 0 0 7 17c0 2.21 2.239 4 5 4Z" />
      </svg>
      <span className="text-dark-text text-sm font-semibold">{streak}</span>
      <span className="text-dark-muted text-xs">day{streak !== 1 ? 's' : ''}</span>
    </div>
  );
}
