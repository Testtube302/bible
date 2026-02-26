import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { NormalizedVerse } from './types.js';
import { BIBLE_BOOKS, normalizeBookName } from './utils.js';

const RAW_DIR = join(import.meta.dirname, '..', 'data', 'raw', 'kjv');
const OUT_DIR = join(import.meta.dirname, '..', 'data', 'normalized');

interface KJVBookJSON {
  book: string;
  chapters: Array<{
    chapter: string;
    verses: Array<{
      verse: string;
      text: string;
    }>;
  }>;
}

export function parseKJV(): NormalizedVerse[] {
  console.log('\n📝 Parsing KJV...');
  const verses: NormalizedVerse[] = [];

  const files = readdirSync(RAW_DIR).filter(f => f.endsWith('.json') && f !== 'Books.json');

  for (const file of files) {
    const raw = readFileSync(join(RAW_DIR, file), 'utf-8');
    const data: KJVBookJSON = JSON.parse(raw);
    const bookName = normalizeBookName(data.book);

    for (const ch of data.chapters) {
      const chapterNum = parseInt(ch.chapter, 10);
      for (const verse of ch.verses) {
        verses.push({
          translation: 'KJV',
          book: bookName,
          chapter: chapterNum,
          verse: parseInt(verse.verse, 10),
          text: verse.text.trim(),
        });
      }
    }
  }

  console.log(`  ✓ Parsed ${verses.length} KJV verses`);
  return verses;
}

export function saveKJV(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const verses = parseKJV();
  writeFileSync(join(OUT_DIR, 'kjv.json'), JSON.stringify(verses));
  console.log(`  ✓ Saved to ${join(OUT_DIR, 'kjv.json')}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  saveKJV();
}
