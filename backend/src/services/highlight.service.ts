import { query } from '../db/postgres.js';
import type { Highlight } from '../types/user.js';

export async function getAllHighlights(userId: string): Promise<Highlight[]> {
  const result = await query(
    'SELECT id, book_name, chapter, verse_start, verse_end, translation, color, created_at FROM highlights WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    bookName: row.book_name,
    chapter: row.chapter,
    verseStart: row.verse_start,
    verseEnd: row.verse_end,
    translation: row.translation,
    color: row.color,
    createdAt: row.created_at,
  }));
}

export async function getChapterHighlights(
  userId: string,
  bookName: string,
  chapter: number
): Promise<Highlight[]> {
  const result = await query(
    'SELECT id, book_name, chapter, verse_start, verse_end, translation, color, created_at FROM highlights WHERE book_name = $1 AND chapter = $2 AND user_id = $3',
    [bookName, chapter, userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    bookName: row.book_name,
    chapter: row.chapter,
    verseStart: row.verse_start,
    verseEnd: row.verse_end,
    translation: row.translation,
    color: row.color,
    createdAt: row.created_at,
  }));
}

export async function createHighlight(
  userId: string,
  bookName: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  translation: string = 'KJV',
  color: string = 'gold'
): Promise<Highlight> {
  const result = await query(
    `INSERT INTO highlights (user_id, book_name, chapter, verse_start, verse_end, translation, color)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, book_name, chapter, verse_start, verse_end, translation, color, created_at`,
    [userId, bookName, chapter, verseStart, verseEnd, translation, color]
  );
  const row = result.rows[0];
  return {
    id: row.id,
    bookName: row.book_name,
    chapter: row.chapter,
    verseStart: row.verse_start,
    verseEnd: row.verse_end,
    translation: row.translation,
    color: row.color,
    createdAt: row.created_at,
  };
}

export async function deleteHighlight(userId: string, id: string): Promise<boolean> {
  const result = await query('DELETE FROM highlights WHERE id = $1 AND user_id = $2', [id, userId]);
  return (result.rowCount ?? 0) > 0;
}
