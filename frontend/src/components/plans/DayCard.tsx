'use client';

import type { PlanReading } from '@/types/plan';

interface DayCardProps {
  reading: PlanReading;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export function DayCard({ reading, isCompleted, isCurrent, onClick }: DayCardProps) {
  const isAccessible = isCompleted || isCurrent;

  return (
    <button
      onClick={isAccessible ? onClick : undefined}
      disabled={!isAccessible}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${
        isCurrent
          ? 'bg-dark-card border-gold/30'
          : isCompleted
          ? 'bg-dark-card border-dark-border hover:border-gold/20'
          : 'bg-dark-surface/50 border-dark-border/50 opacity-50 cursor-not-allowed'
      }`}
    >
      {/* Day number circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCompleted
            ? 'bg-gold/20 text-gold'
            : isCurrent
            ? 'bg-gold text-dark-bg'
            : 'bg-dark-border text-dark-muted'
        }`}
      >
        {isCompleted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <span className="text-sm font-bold">{reading.day}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted ? 'text-gold' : isCurrent ? 'text-dark-text' : 'text-dark-muted'}`}>
          Day {reading.day}: {reading.title}
        </p>
        <p className="text-dark-muted text-xs mt-0.5">
          {reading.passages.map(p => p.label).join(', ')}
        </p>
      </div>

      {/* Current indicator */}
      {isCurrent && !isCompleted && (
        <div className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0" />
      )}
    </button>
  );
}
