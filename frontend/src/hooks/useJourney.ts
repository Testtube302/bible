'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Journey, JourneyDetail } from '@/types/journey';

export function useJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJourneys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ journeys: Journey[] }>('/journeys');
      setJourneys(data.journeys);
    } catch (err) {
      console.error('Failed to fetch journeys:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { journeys, loading, fetchJourneys };
}

export function useJourney() {
  const [journey, setJourney] = useState<JourneyDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchJourney = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const data = await api.get<{ journey: JourneyDetail }>(`/journeys/${slug}`);
      setJourney(data.journey);

      // Auto-generate if no content exists
      if (data.journey.content.length === 0) {
        setGenerating(true);
        try {
          const generated = await api.post<{ journey: JourneyDetail }>(
            `/journeys/${slug}/generate`,
            {}
          );
          setJourney(generated.journey);
        } finally {
          setGenerating(false);
        }
      }
    } catch (err) {
      console.error('Failed to fetch journey:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (slug: string, currentPassage: number) => {
    try {
      await api.put(`/journeys/${slug}/progress`, { current_passage: currentPassage });
      setJourney(prev => prev ? {
        ...prev,
        progress: {
          currentPassage,
          completed: currentPassage >= prev.passages.length - 1,
        },
      } : null);
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  }, []);

  return { journey, loading, generating, fetchJourney, updateProgress };
}
