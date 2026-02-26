'use client';

interface XPBarProps {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
}

export function XPBar({ level, totalXP, xpToNextLevel }: XPBarProps) {
  const xpInCurrentLevel = 100 - xpToNextLevel;
  const percent = Math.round((xpInCurrentLevel / 100) * 100);

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold text-sm font-bold">{level}</span>
          </div>
          <div>
            <p className="text-dark-text text-sm font-medium">Level {level}</p>
            <p className="text-dark-muted text-[10px]">{totalXP} total XP</p>
          </div>
        </div>
        <span className="text-dark-muted text-xs">{xpToNextLevel} XP to next</span>
      </div>
      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
