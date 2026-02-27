'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { QuestDashboard, ChapterQuestion } from '@/types/quest';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/bible/api';

export function useQuest() {
  const [dashboard, setDashboard] = useState<QuestDashboard | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<QuestDashboard>('/quest/dashboard');
      setDashboard(data);
    } catch (err: any) {
      if (err.message?.includes('401')) {
        setDashboard(null);
      } else {
        console.error('Failed to fetch quest dashboard:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { dashboard, loading, fetchDashboard };
}

export function useQuestions() {
  const [questions, setQuestions] = useState<ChapterQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (book: string, chapter: number) => {
    setLoading(true);
    setError(null);
    setQuestions([]);

    // Use AbortController with 2-minute timeout for LLM generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const url = `${API_URL}/quest/questions/${encodeURIComponent(book)}/${chapter}`;
      const response = await fetch(url, {
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please sign in to access quizzes.');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setQuestions(data.questions);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Question generation timed out. Please try again.');
      } else if (!error) {
        setError('Failed to generate questions. Please try again.');
      }
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (
    book: string,
    chapter: number,
    questionIndex: number,
    answer: number
  ): Promise<{ correct: boolean; xpAwarded: number } | null> => {
    try {
      return await api.post<{ correct: boolean; xpAwarded: number }>(
        `/quest/questions/${encodeURIComponent(book)}/${chapter}/answer`,
        { question_index: questionIndex, answer }
      );
    } catch (err) {
      console.error('Failed to submit answer:', err);
      return null;
    }
  }, []);

  return { questions, loading, error, fetchQuestions, submitAnswer };
}
