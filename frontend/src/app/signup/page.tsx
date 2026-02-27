'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      await register(email, password, displayName);
      router.push('/');
    } catch (err: any) {
      setError(err.message ?? 'Registration failed');
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
          <p className="text-dark-muted text-sm mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-burgundy/20 border border-burgundy/40 rounded-lg px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-dark-muted text-xs font-medium mb-1.5">
              Display Name
            </label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-dark-muted text-xs font-medium mb-1.5">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-dark-muted text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
