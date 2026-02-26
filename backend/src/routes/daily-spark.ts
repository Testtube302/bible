import type { FastifyInstance } from 'fastify';
import { query } from '../db/postgres.js';
import { getCollection } from '../db/chromadb.js';
import { getLLMProvider } from '../llm/factory.js';
import {
  DAILY_SPARK_CONTEXT_PROMPT,
  DAILY_SPARK_APPLICATION_PROMPT,
} from '../llm/prompts/daily-spark.js';

// Curated list of great daily verses (diverse books, themes)
const DAILY_VERSES = [
  { book: 'Psalms', chapter: 23, verse: 1 },
  { book: 'Proverbs', chapter: 3, verse: 5 },
  { book: 'Isaiah', chapter: 40, verse: 31 },
  { book: 'Jeremiah', chapter: 29, verse: 11 },
  { book: 'Romans', chapter: 8, verse: 28 },
  { book: 'Philippians', chapter: 4, verse: 13 },
  { book: 'John', chapter: 3, verse: 16 },
  { book: 'Matthew', chapter: 11, verse: 28 },
  { book: 'Psalms', chapter: 46, verse: 10 },
  { book: 'Psalms', chapter: 119, verse: 105 },
  { book: 'Joshua', chapter: 1, verse: 9 },
  { book: 'Isaiah', chapter: 41, verse: 10 },
  { book: 'Lamentations', chapter: 3, verse: 22 },
  { book: 'Philippians', chapter: 4, verse: 6 },
  { book: 'Romans', chapter: 12, verse: 2 },
  { book: '2 Corinthians', chapter: 5, verse: 17 },
  { book: 'Galatians', chapter: 5, verse: 22 },
  { book: 'Ephesians', chapter: 2, verse: 8 },
  { book: 'Hebrews', chapter: 11, verse: 1 },
  { book: 'James', chapter: 1, verse: 2 },
  { book: '1 Peter', chapter: 5, verse: 7 },
  { book: 'Psalms', chapter: 37, verse: 4 },
  { book: 'Proverbs', chapter: 16, verse: 3 },
  { book: 'Isaiah', chapter: 26, verse: 3 },
  { book: 'Matthew', chapter: 6, verse: 33 },
  { book: 'Romans', chapter: 5, verse: 8 },
  { book: 'Psalms', chapter: 139, verse: 14 },
  { book: '2 Timothy', chapter: 1, verse: 7 },
  { book: 'Psalms', chapter: 34, verse: 18 },
  { book: 'John', chapter: 14, verse: 27 },
];

export async function dailySparkRoutes(app: FastifyInstance): Promise<void> {
  app.get('/daily-spark', async (request, reply) => {
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate');
    reply.header('Pragma', 'no-cache');
    const today = new Date().toISOString().split('T')[0];

    // Check cache
    const cached = await query(
      'SELECT * FROM daily_spark_cache WHERE date = $1',
      [today]
    );

    if (cached.rows.length > 0) {
      const row = cached.rows[0];
      return {
        book: row.book,
        chapter: row.chapter,
        verse: row.verse,
        text: row.text,
        translation: row.translation,
        contextText: row.context_text,
        applicationText: row.application_text,
      };
    }

    // Pick verse deterministically by day
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const verseInfo = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];

    // Fetch verse text from ChromaDB
    let verseText = '';
    try {
      const collection = await getCollection('bible_verses');
      const id = `KJV_${verseInfo.book.replace(/\s+/g, '_')}_${verseInfo.chapter}_${verseInfo.verse}`;
      const result = await collection.get({ ids: [id] });
      if (result.documents?.[0]) {
        verseText = result.documents[0];
      }
    } catch {
      // Fallback
    }
    if (!verseText) {
      verseText = 'Thy word is a lamp unto my feet, and a light unto my path.';
    }

    const reference = `${verseInfo.book} ${verseInfo.chapter}:${verseInfo.verse}`;

    // Generate context and application
    let contextText = '';
    let applicationText = '';

    try {
      const llm = getLLMProvider();

      const contextPrompt = DAILY_SPARK_CONTEXT_PROMPT
        .replace('{reference}', reference)
        .replace('{text}', verseText);

      const applicationPrompt = DAILY_SPARK_APPLICATION_PROMPT
        .replace('{reference}', reference)
        .replace('{text}', verseText);

      [contextText, applicationText] = await Promise.all([
        llm.complete([{ role: 'user', content: contextPrompt }]),
        llm.complete([{ role: 'user', content: applicationPrompt }]),
      ]);
    } catch (err) {
      console.error('Failed to generate daily spark content:', err);
    }

    // Cache
    await query(
      `INSERT INTO daily_spark_cache (date, book, chapter, verse, text, translation, context_text, application_text)
       VALUES ($1, $2, $3, $4, $5, 'KJV', $6, $7)
       ON CONFLICT (date) DO NOTHING`,
      [today, verseInfo.book, verseInfo.chapter, verseInfo.verse, verseText, contextText, applicationText]
    );

    return {
      book: verseInfo.book,
      chapter: verseInfo.chapter,
      verse: verseInfo.verse,
      text: verseText,
      translation: 'KJV',
      contextText,
      applicationText,
    };
  });
}
