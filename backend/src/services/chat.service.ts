import { query } from '../db/postgres.js';
import type { ChatMode, ChatMessage, StoredMessage } from '../types/chat.js';

export async function createSession(mode: ChatMode): Promise<string> {
  const result = await query(
    'INSERT INTO chat_sessions (mode) VALUES ($1) RETURNING id',
    [mode]
  );
  return result.rows[0].id;
}

export async function getSessionHistory(sessionId: string): Promise<ChatMessage[]> {
  const result = await query(
    'SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
    [sessionId]
  );
  return result.rows.map(row => ({
    role: row.role,
    content: row.content,
  }));
}

export async function saveMessage(
  sessionId: string,
  role: string,
  content: string,
  versesCited?: string[]
): Promise<string> {
  const result = await query(
    'INSERT INTO chat_messages (session_id, role, content, verses_cited) VALUES ($1, $2, $3, $4) RETURNING id',
    [sessionId, role, content, versesCited ?? null]
  );

  // Update session title from first user message
  if (role === 'user') {
    await query(
      `UPDATE chat_sessions SET title = COALESCE(title, $1), updated_at = NOW() WHERE id = $2`,
      [content.substring(0, 100), sessionId]
    );
  } else {
    await query(
      'UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1',
      [sessionId]
    );
  }

  return result.rows[0].id;
}

export async function getAllSessions(): Promise<any[]> {
  const result = await query(
    'SELECT id, title, mode, created_at, updated_at FROM chat_sessions ORDER BY updated_at DESC'
  );
  return result.rows;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]);
}
