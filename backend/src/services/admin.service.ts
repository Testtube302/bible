import { randomBytes } from 'crypto';
import { query } from '../db/postgres.js';
import { config } from '../config.js';
import type { AnalyticsSummary, PopularBook } from '../types/admin.js';

export async function login(username: string, password: string): Promise<string | null> {
  if (username !== config.ADMIN_USERNAME || password !== config.ADMIN_PASSWORD) {
    return null;
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await query(
    'INSERT INTO admin_sessions (token, expires_at) VALUES ($1, $2)',
    [token, expiresAt]
  );

  // Clean up expired sessions
  await query('DELETE FROM admin_sessions WHERE expires_at < NOW()').catch(() => {});

  return token;
}

export async function logout(token: string): Promise<void> {
  await query('DELETE FROM admin_sessions WHERE token = $1', [token]);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [chapters, bookmarks, highlights, sessions, messages, streakData] = await Promise.all([
    query('SELECT COUNT(*) FROM reading_progress WHERE completed = TRUE'),
    query('SELECT COUNT(*) FROM bookmarks'),
    query('SELECT COUNT(*) FROM highlights'),
    query('SELECT COUNT(*) FROM chat_sessions'),
    query('SELECT COUNT(*) FROM chat_messages'),
    query('SELECT date FROM reading_streaks ORDER BY date DESC LIMIT 365'),
  ]);

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const dates = streakData.rows.map(r => r.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (i === 0 && diff <= 1) currentStreak = 1;
    if (i > 0) {
      const prev = new Date(dates[i - 1]);
      prev.setHours(0, 0, 0, 0);
      const gap = Math.round((prev.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (gap === 1) {
        tempStreak++;
        if (i < 2 || currentStreak > 0) currentStreak = tempStreak + 1;
      } else {
        tempStreak = 0;
        if (i >= 1) currentStreak = Math.min(currentStreak, i);
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak + 1);
  }

  return {
    totalChaptersRead: parseInt(chapters.rows[0].count, 10),
    totalBookmarks: parseInt(bookmarks.rows[0].count, 10),
    totalHighlights: parseInt(highlights.rows[0].count, 10),
    totalChatSessions: parseInt(sessions.rows[0].count, 10),
    totalChatMessages: parseInt(messages.rows[0].count, 10),
    currentStreak,
    longestStreak,
  };
}

export async function getTopSearches(limit: number = 20): Promise<Array<{ query: string; count: number }>> {
  const result = await query(
    `SELECT event_data->>'query' as query, COUNT(*) as count
     FROM analytics_events
     WHERE event_type = 'search' AND event_data->>'query' IS NOT NULL
     GROUP BY event_data->>'query'
     ORDER BY count DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows.map(r => ({ query: r.query, count: parseInt(r.count, 10) }));
}

export async function getPopularBooks(limit: number = 10): Promise<PopularBook[]> {
  const result = await query(
    `SELECT book_name, COUNT(*) as chapters_read
     FROM reading_progress WHERE completed = TRUE
     GROUP BY book_name
     ORDER BY chapters_read DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows.map(r => ({
    bookName: r.book_name,
    chaptersRead: parseInt(r.chapters_read, 10),
  }));
}
