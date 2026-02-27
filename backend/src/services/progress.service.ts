import { query } from '../db/postgres.js';
import type { ReadingProgress, ReadingStreak } from '../types/user.js';
import { awardChapterXP, awardStreakXP, checkAndUnlockAchievements } from './quest.service.js';

export async function getOverallProgress(userId: string): Promise<{
  totalChapters: number;
  completedChapters: number;
  books: Array<{ bookName: string; completed: number; total: number }>;
}> {
  const booksResult = await query(
    'SELECT name, chapter_count FROM bible_books ORDER BY book_order'
  );

  const progressResult = await query(
    'SELECT book_name, COUNT(*) as completed FROM reading_progress WHERE completed = TRUE AND user_id = $1 GROUP BY book_name',
    [userId]
  );

  const completedMap = new Map(
    progressResult.rows.map(r => [r.book_name, parseInt(r.completed, 10)])
  );

  const totalChapters = booksResult.rows.reduce((sum, r) => sum + r.chapter_count, 0);
  const completedChapters = progressResult.rows.reduce((sum, r) => sum + parseInt(r.completed, 10), 0);

  return {
    totalChapters,
    completedChapters,
    books: booksResult.rows.map(r => ({
      bookName: r.name,
      completed: completedMap.get(r.name) ?? 0,
      total: r.chapter_count,
    })),
  };
}

export async function getBookProgress(userId: string, bookName: string): Promise<ReadingProgress[]> {
  const result = await query(
    'SELECT book_name, chapter, completed, last_verse_read, read_at FROM reading_progress WHERE book_name = $1 AND user_id = $2 ORDER BY chapter',
    [bookName, userId]
  );
  return result.rows.map(row => ({
    bookName: row.book_name,
    chapter: row.chapter,
    completed: row.completed,
    lastVerseRead: row.last_verse_read,
    readAt: row.read_at,
  }));
}

export async function updateChapterProgress(
  userId: string,
  bookName: string,
  chapter: number,
  completed: boolean,
  lastVerseRead: number
): Promise<void> {
  await query(
    `INSERT INTO reading_progress (user_id, book_name, chapter, completed, last_verse_read, read_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (user_id, book_name, chapter)
     DO UPDATE SET completed = $4, last_verse_read = $5, read_at = NOW()`,
    [userId, bookName, chapter, completed, lastVerseRead]
  );

  // Update streak
  await query(
    `INSERT INTO reading_streaks (user_id, date, chapters_read)
     VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (user_id, date)
     DO UPDATE SET chapters_read = reading_streaks.chapters_read + 1`,
    [userId]
  );

  // Log analytics
  await query(
    'INSERT INTO analytics_events (event_type, event_data) VALUES ($1, $2)',
    ['read_chapter', JSON.stringify({ bookName, chapter, completed })]
  ).catch(() => {});

  // Award XP and check achievements
  try {
    await awardChapterXP(userId, bookName, chapter);
    await awardStreakXP(userId);
    await checkAndUnlockAchievements(userId);
  } catch {
    // Quest system failures should not block reading progress
  }
}

export async function getStreakData(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  recentDays: ReadingStreak[];
}> {
  // Get recent streak data
  const result = await query(
    'SELECT date, chapters_read, minutes_spent FROM reading_streaks WHERE user_id = $1 ORDER BY date DESC LIMIT 90',
    [userId]
  );

  const recentDays: ReadingStreak[] = result.rows.map(r => ({
    date: r.date.toISOString().split('T')[0],
    chaptersRead: r.chapters_read,
    minutesSpent: r.minutes_spent,
  }));

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const day of recentDays) {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === currentStreak) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const allDates = recentDays.map(d => d.date).reverse();

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(allDates[i - 1]);
      const curr = new Date(allDates[i]);
      const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return { currentStreak, longestStreak, recentDays: recentDays.slice(0, 30) };
}
