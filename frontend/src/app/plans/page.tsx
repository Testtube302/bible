'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ArtworkBackground } from '@/components/ui/ArtworkBackground';
import { PlanCard } from '@/components/plans/PlanCard';
import { CategoryChip } from '@/components/plans/CategoryChip';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePlans } from '@/hooks/usePlans';

export default function PlansPage() {
  const { plans, categories, loading, fetchPlans, fetchCategories } = usePlans();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchPlans();
  }, [fetchCategories, fetchPlans]);

  const handleCategoryChange = (slug: string | null) => {
    setActiveCategory(slug);
    if (slug) {
      fetchPlans(slug);
    } else {
      fetchPlans();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <ArtworkBackground
        src="/bible/artwork/dore/moses-tablets.webp"
        alt="Moses with the Tablets of Law by Gustave Doré"
        overlay="heavy"
        className="min-h-[30vh] flex items-end"
      >
        <div className="max-w-3xl mx-auto px-4 py-10 w-full">
          <h1 className="text-gold font-serif text-3xl sm:text-4xl font-bold mb-2">
            Reading Plans
          </h1>
          <p className="text-cream/70 text-sm sm:text-base">
            Grow daily with guided Scripture devotionals
          </p>
        </div>
      </ArtworkBackground>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeCategory === null
                  ? 'bg-gold/20 text-gold border-gold/30'
                  : 'bg-dark-card text-dark-muted border-dark-border hover:border-gold/20 hover:text-dark-text'
              }`}
            >
              All Plans
            </button>
            {categories.map(cat => (
              <CategoryChip
                key={cat.slug}
                category={cat}
                active={activeCategory === cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
              />
            ))}
          </div>
        )}

        {/* Plans grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {plans.map(plan => (
              <PlanCard key={plan.slug} plan={plan} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
