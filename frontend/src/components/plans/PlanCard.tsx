'use client';

import Link from 'next/link';
import type { Plan } from '@/types/plan';

interface PlanCardProps {
  plan: Plan;
}

const CATEGORY_COLORS: Record<string, string> = {
  emotions: 'from-rose-900/40 to-dark-card',
  relationships: 'from-amber-900/40 to-dark-card',
  'faith-foundations': 'from-blue-900/40 to-dark-card',
  seasonal: 'from-emerald-900/40 to-dark-card',
  'book-studies': 'from-purple-900/40 to-dark-card',
  topical: 'from-cyan-900/40 to-dark-card',
};

export function PlanCard({ plan }: PlanCardProps) {
  const completedCount = plan.progress?.completedDays?.length ?? 0;
  const progressPercent = Math.round((completedCount / plan.durationDays) * 100);
  const gradient = CATEGORY_COLORS[plan.categorySlug] || 'from-dark-surface to-dark-card';

  return (
    <Link href={`/plans/${plan.slug}`}>
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-gold/30 transition-colors group">
        {/* Gradient header */}
        <div className={`relative h-24 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
          <span className="absolute top-3 left-3 bg-dark-bg/80 text-gold text-[10px] font-medium px-2 py-0.5 rounded-full">
            {plan.durationDays} days
          </span>
          {plan.progress?.completedAt && (
            <span className="absolute top-3 right-3 bg-gold/20 text-gold text-[10px] font-medium px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-gold font-serif text-base font-semibold mb-1">
            {plan.title}
          </h3>
          <p className="text-dark-muted text-xs leading-relaxed line-clamp-2 mb-3">
            {plan.description}
          </p>
          <div className="flex items-center justify-between text-[10px] text-dark-muted">
            <span>{completedCount} of {plan.durationDays} days</span>
            {plan.progress && !plan.progress.completedAt && completedCount > 0 && (
              <span className="text-gold">{progressPercent}%</span>
            )}
          </div>
          {/* Progress bar */}
          {plan.progress && !plan.progress.completedAt && completedCount > 0 && (
            <div className="mt-2 h-1 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
