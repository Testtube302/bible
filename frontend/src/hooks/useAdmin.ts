'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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

  // User CRUD functions
  const fetchUsers = useCallback(async (): Promise<AdminUser[]> => {
    const data = await api.get<{ users: AdminUser[] }>('/admin/users');
    return data.users;
  }, []);

  const createUser = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    role: string = 'user'
  ): Promise<AdminUser> => {
    const data = await api.post<{ user: AdminUser }>('/admin/users', {
      email, password, displayName, role,
    });
    return data.user;
  }, []);

  const updateUser = useCallback(async (
    id: string,
    updates: { email?: string; displayName?: string; role?: string }
  ): Promise<AdminUser> => {
    const data = await api.put<{ user: AdminUser }>(`/admin/users/${id}`, updates);
    return data.user;
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  }, []);

  const resetPassword = useCallback(async (id: string, password: string): Promise<void> => {
    await api.put(`/admin/users/${id}/password`, { password });
  }, []);

  return {
    isAuthenticated, loading, error,
    login, logout, checkAuth,
    fetchUsers, createUser, updateUser, deleteUser, resetPassword,
  };
}
