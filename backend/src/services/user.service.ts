import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { query } from '../db/postgres.js';

const SALT_ROUNDS = 12;
const SESSION_EXPIRY_DAYS = 7;

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export async function register(
  email: string,
  password: string,
  displayName: string
): Promise<{ user: User; token: string }> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await query(
    `INSERT INTO users (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, display_name, role, created_at, updated_at`,
    [email.toLowerCase().trim(), passwordHash, displayName.trim()]
  );

  const row = result.rows[0];
  const user = mapUser(row);

  const token = await createSessionToken(user.id);
  return { user, token };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  const result = await query(
    'SELECT id, email, display_name, role, password_hash, created_at, updated_at FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) return null;

  const user = mapUser(row);
  const token = await createSessionToken(user.id);
  return { user, token };
}

export async function logout(token: string): Promise<void> {
  await query('DELETE FROM user_sessions WHERE token = $1', [token]);
}

export async function validateSession(
  token: string
): Promise<{ userId: string; role: string } | null> {
  const result = await query(
    `SELECT u.id as user_id, u.role
     FROM user_sessions us
     JOIN users u ON u.id = us.user_id
     WHERE us.token = $1 AND us.expires_at > NOW()`,
    [token]
  );

  if (result.rows.length === 0) return null;
  return { userId: result.rows[0].user_id, role: result.rows[0].role };
}

export async function getProfile(userId: string): Promise<User | null> {
  const result = await query(
    'SELECT id, email, display_name, role, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) return null;
  return mapUser(result.rows[0]);
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const result = await query(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId]
  );
  if (result.rows.length === 0) return false;

  const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
  if (!valid) return false;

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, userId]
  );
  return true;
}

// -- Admin functions --

export async function listUsers(): Promise<User[]> {
  const result = await query(
    'SELECT id, email, display_name, role, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return result.rows.map(mapUser);
}

export async function createUser(
  email: string,
  password: string,
  displayName: string,
  role: string = 'user'
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await query(
    `INSERT INTO users (email, password_hash, display_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, display_name, role, created_at, updated_at`,
    [email.toLowerCase().trim(), passwordHash, displayName.trim(), role]
  );
  return mapUser(result.rows[0]);
}

export async function updateUser(
  id: string,
  updates: { email?: string; displayName?: string; role?: string }
): Promise<User | null> {
  const sets: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (updates.email) {
    sets.push(`email = $${idx++}`);
    params.push(updates.email.toLowerCase().trim());
  }
  if (updates.displayName) {
    sets.push(`display_name = $${idx++}`);
    params.push(updates.displayName.trim());
  }
  if (updates.role) {
    sets.push(`role = $${idx++}`);
    params.push(updates.role);
  }

  if (sets.length === 0) return getProfile(id);

  sets.push('updated_at = NOW()');
  params.push(id);

  const result = await query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx}
     RETURNING id, email, display_name, role, created_at, updated_at`,
    params
  );

  if (result.rows.length === 0) return null;
  return mapUser(result.rows[0]);
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await query('DELETE FROM users WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function resetPassword(
  id: string,
  newPassword: string
): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const result = await query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [passwordHash, id]
  );
  // Clear all sessions for this user
  await query('DELETE FROM user_sessions WHERE user_id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

// -- Helpers --

async function createSessionToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await query(
    'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );

  // Clean expired sessions for this user
  await query(
    'DELETE FROM user_sessions WHERE user_id = $1 AND expires_at < NOW()',
    [userId]
  ).catch(() => {});

  return token;
}

function mapUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    createdAt: row.created_at?.toISOString?.() ?? row.created_at,
    updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
  };
}
