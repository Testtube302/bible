'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  [key: string]: any;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    password?: string;
    displayName: string;
    role: string;
  }) => Promise<void>;
  user?: User | null; // null = create mode, User = edit mode
  error?: string | null;
}

export function UserFormModal({ isOpen, onClose, onSubmit, user, error }: UserFormModalProps) {
  const isEditing = !!user;

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setDisplayName(user.displayName);
      setRole(user.role);
      setPassword('');
    } else {
      setEmail('');
      setDisplayName('');
      setPassword('');
      setRole('user');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        email,
        displayName,
        role,
        ...(isEditing ? {} : { password }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-dark-text font-semibold text-lg mb-4">
        {isEditing ? 'Edit User' : 'Add User'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-burgundy/20 border border-burgundy/40 rounded-lg px-4 py-2.5 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="block text-dark-muted text-xs font-medium mb-1.5">
            Display Name
          </label>
          <Input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="User name"
            required
          />
        </div>

        <div>
          <label className="block text-dark-muted text-xs font-medium mb-1.5">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>

        {!isEditing && (
          <div>
            <label className="block text-dark-muted text-xs font-medium mb-1.5">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>
        )}

        <div>
          <label className="block text-dark-muted text-xs font-medium mb-1.5">
            Role
          </label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full rounded-lg bg-dark-card border border-dark-border px-4 py-2.5 text-dark-text focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-colors"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Reset Password Modal
interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  userName?: string;
}

export function ResetPasswordModal({ isOpen, onClose, onSubmit, userName }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setPassword('');
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-dark-text font-semibold text-lg mb-4">
        Reset Password{userName ? ` — ${userName}` : ''}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-dark-muted text-xs font-medium mb-1.5">
            New Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
