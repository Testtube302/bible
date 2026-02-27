'use client';

import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit, onResetPassword, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-dark-muted text-sm p-4">No users found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left text-dark-muted text-xs font-medium px-4 py-2">Name</th>
            <th className="text-left text-dark-muted text-xs font-medium px-4 py-2">Email</th>
            <th className="text-left text-dark-muted text-xs font-medium px-4 py-2">Role</th>
            <th className="text-left text-dark-muted text-xs font-medium px-4 py-2">Joined</th>
            <th className="text-right text-dark-muted text-xs font-medium px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-dark-border/50 last:border-0">
              <td className="text-dark-text text-sm px-4 py-2.5">{user.displayName}</td>
              <td className="text-dark-muted text-sm px-4 py-2.5">{user.email}</td>
              <td className="px-4 py-2.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-gold/20 text-gold'
                    : 'bg-dark-surface text-dark-muted'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="text-dark-muted text-xs px-4 py-2.5">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onResetPassword(user)}>
                    Reset PW
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(user)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
