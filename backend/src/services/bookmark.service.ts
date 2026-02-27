import { query } from '../db/postgres.js';
import type { Bookmark } from '../types/user.js';

export async function getAllBookmarks(userId: string): Promise<Bookmark[]> {
  const result = await query(
    'SELECT id, book_name, chapter, verse, translation, note, created_at FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    bookName: row.book_name,
    chapter: row.chapter,
    verse: row.verse,
    translation: row.translation,
    note: row.note,
    createdAt: row.created_at,
  }));
}

export async function createBookmark(
  userId: string,
  bookName: string,
  chapter: number,
  verse: number,
  translation: string = 'KJV',
  note?: string
): Promise<Bookmark> {
  const result = await query(
    `INSERT INTO bookmarks (user_id, book_name, chapter, verse, translation, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, book_name, chapter, verse, translation) DO UPDATE SET note = COALESCE($6, bookmarks.note)
     RETURNING id, book_name, chapter, verse, translation, note, created_at`,
    [userId, bookName, chapter, verse, translation, note ?? null]
  );
  const row = result.rows[0];
  return {
    id: row.id,
    bookName: row.book_name,
    chapter: row.chapter,
    verse: row.verse,
    translation: row.translation,
    note: row.note,
    createdAt: row.created_at,
  };
}

export async function deleteBookmark(userId: string, id: string): Promise<boolean> {
  const result = await query('DELETE FROM bookmarks WHERE id = $1 AND user_id = $2', [id, userId]);
  return (result.rowCount ?? 0) > 0;
}
