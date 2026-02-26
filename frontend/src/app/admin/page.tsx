'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminLoginPage() {
  const { isAuthenticated, loading, error, login, checkAuth } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <LoginForm onLogin={login} loading={loading} error={error} />
    </div>
  );
}
