'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Plan, PlanDetail, PlanCategory } from '@/types/plan';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<PlanCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = useCallback(async (categorySlug?: string) => {
    setLoading(true);
    try {
      const url = categorySlug ? `/plans?category=${categorySlug}` : '/plans';
      const data = await api.get<{ plans: Plan[] }>(url);
      setPlans(data.plans);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<{ categories: PlanCategory[] }>('/plans/categories');
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  return { plans, categories, loading, fetchPlans, fetchCategories };
}

export function usePlan() {
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchPlan = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const data = await api.get<{ plan: PlanDetail }>(`/plans/${slug}`);
      setPlan(data.plan);

      // Auto-generate if no content exists
      if (data.plan.content.length === 0) {
        setGenerating(true);
        try {
          const generated = await api.post<{ plan: PlanDetail }>(
            `/plans/${slug}/generate`,
            {}
          );
          setPlan(generated.plan);
        } finally {
          setGenerating(false);
        }
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeDay = useCallback(async (slug: string, day: number) => {
    try {
      await api.put(`/plans/${slug}/progress`, { day, completed: true });
      setPlan(prev => {
        if (!prev) return null;
        const completedDays = [...(prev.progress?.completedDays || [])];
        if (!completedDays.includes(day)) {
          completedDays.push(day);
          completedDays.sort((a, b) => a - b);
        }
        const nextDay = Math.min(
          Math.max(...completedDays) + 1,
          prev.durationDays
        );
        return {
          ...prev,
          progress: {
            currentDay: nextDay,
            completedDays,
            completedAt: completedDays.length >= prev.durationDays
              ? new Date().toISOString()
              : null,
          },
        };
      });
    } catch (err) {
      console.error('Failed to complete day:', err);
    }
  }, []);

  return { plan, loading, generating, fetchPlan, completeDay };
}
