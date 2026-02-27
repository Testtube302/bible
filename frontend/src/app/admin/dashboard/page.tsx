'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalyticsCards } from '@/components/admin/AnalyticsCards';
import { UserTable } from '@/components/admin/UserTable';
import { UserFormModal, ResetPasswordModal } from '@/components/admin/UserFormModal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAdmin } from '@/hooks/useAdmin';
import { api } from '@/lib/api';

interface AnalyticsSummary {
  totalChaptersRead: number;
  totalBookmarks: number;
  totalHighlights: number;
  totalChatSessions: number;
  totalChatMessages: number;
  currentStreak: number;
  longestStreak: number;
}

interface TopSearch {
  query: string;
  count: number;
}

interface PopularBook {
  bookName: string;
  chaptersRead: number;
}

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const {
    isAuthenticated, checkAuth, logout,
    fetchUsers, createUser, updateUser, deleteUser, resetPassword,
  } = useAdmin();
  const router = useRouter();

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showResetPw, setShowResetPw] = useState(false);
  const [resetPwUser, setResetPwUser] = useState<AdminUser | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      try {
        const [summary, searches, books, userList] = await Promise.all([
          api.get<AnalyticsSummary>('/admin/analytics/summary'),
          api.get<{ searches: TopSearch[] }>('/admin/analytics/searches'),
          api.get<{ books: PopularBook[] }>('/admin/analytics/popular-books'),
          fetchUsers(),
        ]);
        setAnalytics(summary);
        setTopSearches(searches.searches);
        setPopularBooks(books.books);
        setUsers(userList);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated, fetchUsers]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin');
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormError(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setFormError(null);
    setShowUserForm(true);
  };

  const handleUserFormSubmit = async (data: {
    email: string;
    password?: string;
    displayName: string;
    role: string;
  }) => {
    setFormError(null);
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, {
          email: data.email,
          displayName: data.displayName,
          role: data.role,
        });
        setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
      } else {
        const created = await createUser(data.email, data.password!, data.displayName, data.role);
        setUsers(prev => [created, ...prev]);
      }
      setShowUserForm(false);
    } catch (err: any) {
      setFormError(err.message ?? 'Failed to save user');
    }
  };

  const handleResetPassword = (user: AdminUser) => {
    setResetPwUser(user);
    setShowResetPw(true);
  };

  const handleResetPasswordSubmit = async (password: string) => {
    if (!resetPwUser) return;
    await resetPassword(resetPwUser.id, password);
    setShowResetPw(false);
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Delete user "${user.displayName}" (${user.email})? This will permanently remove all their data.`)) {
      return;
    }
    try {
      await deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err: any) {
      alert(err.message ?? 'Failed to delete user');
    }
  };

  if (isAuthenticated !== true) return null;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-gold font-serif text-xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Analytics overview */}
            <section>
              <h2 className="text-dark-text font-semibold mb-4">Overview</h2>
              <AnalyticsCards data={analytics} />
            </section>

            {/* Users */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-dark-text font-semibold">Users</h2>
                <Button size="sm" onClick={handleAddUser}>Add User</Button>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
                <UserTable
                  users={users}
                  onEdit={handleEditUser}
                  onResetPassword={handleResetPassword}
                  onDelete={handleDeleteUser}
                />
              </div>
            </section>

            {/* Top Searches */}
            <section>
              <h2 className="text-dark-text font-semibold mb-4">Top Searches</h2>
              <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
                {topSearches.length === 0 ? (
                  <p className="text-dark-muted text-sm p-4">No searches yet</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="text-left text-dark-muted text-xs font-medium px-4 py-2">Query</th>
                        <th className="text-right text-dark-muted text-xs font-medium px-4 py-2">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSearches.map((s, i) => (
                        <tr key={i} className="border-b border-dark-border/50 last:border-0">
                          <td className="text-dark-text text-sm px-4 py-2.5">{s.query}</td>
                          <td className="text-gold text-sm text-right px-4 py-2.5">{s.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* Popular Books */}
            <section>
              <h2 className="text-dark-text font-semibold mb-4">Most Read Books</h2>
              <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
                {popularBooks.length === 0 ? (
                  <p className="text-dark-muted text-sm p-4">No reading progress yet</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="text-left text-dark-muted text-xs font-medium px-4 py-2">Book</th>
                        <th className="text-right text-dark-muted text-xs font-medium px-4 py-2">Chapters</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularBooks.map((b, i) => (
                        <tr key={i} className="border-b border-dark-border/50 last:border-0">
                          <td className="text-dark-text text-sm px-4 py-2.5">{b.bookName}</td>
                          <td className="text-gold text-sm text-right px-4 py-2.5">{b.chaptersRead}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modals */}
      <UserFormModal
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        onSubmit={handleUserFormSubmit}
        user={editingUser}
        error={formError}
      />
      <ResetPasswordModal
        isOpen={showResetPw}
        onClose={() => setShowResetPw(false)}
        onSubmit={handleResetPasswordSubmit}
        userName={resetPwUser?.displayName}
      />
    </div>
  );
}
