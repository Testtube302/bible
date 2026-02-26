'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface Topic {
  slug: string;
  label: string;
  description: string;
}

export interface TopicVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface TopicDetail {
  topic: string;
  label: string;
  description: string;
  summary: string;
  versesCited: string[];
  verses: TopicVerse[];
}

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ topics: Topic[] }>('/topics');
      setTopics(data.topics);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { topics, loading, fetchTopics };
}

export function useTopic() {
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTopic = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const data = await api.get<TopicDetail>(`/topics/${slug}`);
      setTopic(data);
    } catch (err) {
      console.error('Failed to fetch topic:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { topic, loading, fetchTopic };
}
