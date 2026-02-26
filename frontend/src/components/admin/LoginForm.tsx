'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({ onLogin, loading, error }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-gold font-serif text-2xl font-bold">Admin</h1>
        <p className="text-dark-muted text-sm mt-1">Sign in to manage Scripture</p>
      </div>

      {error && (
        <div className="bg-burgundy/20 border border-burgundy/30 rounded-lg px-4 py-2 text-burgundy-light text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !username || !password}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
