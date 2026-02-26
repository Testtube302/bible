'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/login', { username, password });
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/admin/logout', {});
    } catch {
      // ignore logout errors
    }
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      await api.get('/admin/analytics/summary');
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, loading, error, login, logout, checkAuth };
}
