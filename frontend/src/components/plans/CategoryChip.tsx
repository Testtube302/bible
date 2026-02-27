'use client';

import type { PlanCategory } from '@/types/plan';

interface CategoryChipProps {
  category: PlanCategory;
  active: boolean;
  onClick: () => void;
}

export function CategoryChip({ category, active, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? 'bg-gold/20 text-gold border-gold/30'
          : 'bg-dark-card text-dark-muted border-dark-border hover:border-gold/20 hover:text-dark-text'
      }`}
    >
      {category.name}
      <span className="ml-1 opacity-60">{category.planCount}</span>
    </button>
  );
}
