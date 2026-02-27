import { query } from '../db/postgres.js';

export interface NotebookEntry {
  id: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  translation: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: any): NotebookEntry {
  return {
    id: row.id,
    bookName: row.book_name,
    chapter: row.chapter,
    verse: row.verse,
    verseText: row.verse_text,
    translation: row.translation,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllEntries(userId: string): Promise<NotebookEntry[]> {
  const result = await query(
    'SELECT id, book_name, chapter, verse, verse_text, translation, notes, created_at, updated_at FROM notebook_entries WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(mapRow);
}

export async function createEntry(
  userId: string,
  bookName: string,
  chapter: number,
  verse: number,
  verseText: string,
  translation: string = 'KJV',
  notes: string = ''
): Promise<NotebookEntry> {
  const result = await query(
    `INSERT INTO notebook_entries (user_id, book_name, chapter, verse, verse_text, translation, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id, book_name, chapter, verse, translation)
     DO UPDATE SET verse_text = EXCLUDED.verse_text, notes = CASE WHEN notebook_entries.notes = '' THEN EXCLUDED.notes ELSE notebook_entries.notes END, updated_at = NOW()
     RETURNING id, book_name, chapter, verse, verse_text, translation, notes, created_at, updated_at`,
    [userId, bookName, chapter, verse, verseText, translation, notes]
  );
  return mapRow(result.rows[0]);
}

export async function updateEntryNotes(userId: string, id: string, notes: string): Promise<NotebookEntry | null> {
  const result = await query(
    `UPDATE notebook_entries SET notes = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3
     RETURNING id, book_name, chapter, verse, verse_text, translation, notes, created_at, updated_at`,
    [notes, id, userId]
  );
  if (result.rows.length === 0) return null;
  return mapRow(result.rows[0]);
}

export async function deleteEntry(userId: string, id: string): Promise<boolean> {
  const result = await query('DELETE FROM notebook_entries WHERE id = $1 AND user_id = $2', [id, userId]);
  return (result.rowCount ?? 0) > 0;
}
