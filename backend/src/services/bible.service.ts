import { getCollection } from '../db/chromadb.js';
import { query } from '../db/postgres.js';
import type { BibleBook, Verse, CrossReference, Translation } from '../types/bible.js';

export async function getAllBooks(): Promise<BibleBook[]> {
  const result = await query(
    'SELECT id, name, abbreviation, testament, book_order, chapter_count, verse_count FROM bible_books ORDER BY book_order'
  );
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    abbreviation: row.abbreviation,
    testament: row.testament,
    bookOrder: row.book_order,
    chapterCount: row.chapter_count,
    verseCount: row.verse_count,
  }));
}

export async function getBooksByTestament(testament: string): Promise<BibleBook[]> {
  const result = await query(
    'SELECT id, name, abbreviation, testament, book_order, chapter_count, verse_count FROM bible_books WHERE testament = $1 ORDER BY book_order',
    [testament.toUpperCase()]
  );
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    abbreviation: row.abbreviation,
    testament: row.testament,
    bookOrder: row.book_order,
    chapterCount: row.chapter_count,
    verseCount: row.verse_count,
  }));
}

export async function getBookInfo(bookName: string): Promise<BibleBook | null> {
  const result = await query(
    'SELECT id, name, abbreviation, testament, book_order, chapter_count, verse_count FROM bible_books WHERE LOWER(name) = LOWER($1) OR LOWER(abbreviation) = LOWER($1)',
    [bookName]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    abbreviation: row.abbreviation,
    testament: row.testament,
    bookOrder: row.book_order,
    chapterCount: row.chapter_count,
    verseCount: row.verse_count,
  };
}

export async function getChapter(
  bookName: string,
  chapter: number,
  translation: Translation = 'KJV'
): Promise<Verse[]> {
  const collection = await getCollection('bible_verses');

  const results = await collection.get({
    where: {
      $and: [
        { book: { $eq: bookName } },
        { chapter: { $eq: chapter } },
        { translation: { $eq: translation } },
      ],
    },
  });

  if (!results.ids.length) return [];

  const verses: Verse[] = [];
  for (let i = 0; i < results.ids.length; i++) {
    const meta = results.metadatas?.[i] as Record<string, any> | undefined;
    verses.push({
      book: (meta?.book as string) ?? bookName,
      chapter: (meta?.chapter as number) ?? chapter,
      verse: (meta?.verse as number) ?? 0,
      text: results.documents?.[i] ?? '',
      translation: (meta?.translation as Translation) ?? translation,
    });
  }

  return verses.sort((a, b) => a.verse - b.verse);
}

export async function getVerse(
  bookName: string,
  chapter: number,
  verse: number
): Promise<Record<Translation, string>> {
  const collection = await getCollection('bible_verses');

  const translations: Record<string, string> = {};

  for (const t of ['KJV', 'WEB', 'ASV'] as Translation[]) {
    const id = `${t}_${bookName.replace(/\s+/g, '_')}_${chapter}_${verse}`;
    try {
      const result = await collection.get({ ids: [id] });
      if (result.documents?.[0]) {
        translations[t] = result.documents[0];
      }
    } catch {
      // verse not found in this translation
    }
  }

  return translations as Record<Translation, string>;
}

export async function getCrossReferences(
  bookName: string,
  chapter: number,
  verse: number
): Promise<CrossReference[]> {
  const result = await query(
    `SELECT from_book, from_chapter, from_verse, to_book, to_chapter, to_verse_start, to_verse_end, votes
     FROM cross_references
     WHERE from_book = $1 AND from_chapter = $2 AND from_verse = $3
     ORDER BY votes DESC`,
    [bookName, chapter, verse]
  );

  return result.rows.map(row => ({
    fromBook: row.from_book,
    fromChapter: row.from_chapter,
    fromVerse: row.from_verse,
    toBook: row.to_book,
    toChapter: row.to_chapter,
    toVerseStart: row.to_verse_start,
    toVerseEnd: row.to_verse_end,
    votes: row.votes ?? 0,
  }));
}
