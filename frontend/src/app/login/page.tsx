'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-gold text-3xl font-serif font-bold tracking-wide">Scripture</h1>
          <p className="text-dark-muted text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-burgundy/20 border border-burgundy/40 rounded-lg px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-dark-muted text-xs font-medium mb-1.5">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-dark-muted text-xs font-medium mb-1.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-dark-muted text-sm mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-gold hover:text-gold-light transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
