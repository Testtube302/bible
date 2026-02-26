import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { NormalizedVerse } from './types.js';
import { normalizeBookName, BIBLE_BOOKS } from './utils.js';

const RAW_DIR = join(import.meta.dirname, '..', 'data', 'raw', 'web');
const OUT_DIR = join(import.meta.dirname, '..', 'data', 'normalized');

// scrollmapper t_web.json format: array of objects with book_id, chapter, verse, text
interface ScrollmapperVerse {
  id: number;
  b: number;   // book number (1-66)
  c: number;   // chapter
  v: number;   // verse
  t: string;   // text
}

// Book ID to name mapping from scrollmapper
function getBookNameById(bookId: number): string {
  const book = BIBLE_BOOKS.find(b => b.order === bookId);
  return book?.name ?? `Book${bookId}`;
}

export function parseWEB(): NormalizedVerse[] {
  console.log('\n📝 Parsing WEB...');
  const verses: NormalizedVerse[] = [];

  const filePath = join(RAW_DIR, 'web.json');
  if (!existsSync(filePath)) {
    console.error('  ✗ web.json not found. Run download first.');
    return verses;
  }

  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  // scrollmapper format: { resultset: { row: [[id, b, c, v, t], ...] } }
  // or plain array of objects with {id, b, c, v, t}
  let data: ScrollmapperVerse[];
  if (parsed.resultset?.row) {
    // scrollmapper format: { resultset: { row: [{ field: [id, b, c, v, t] }, ...] } }
    data = parsed.resultset.row.map((r: any) => {
      const f = r.field ?? r;
      return { id: f[0], b: f[1], c: f[2], v: f[3], t: f[4] };
    });
  } else if (Array.isArray(parsed)) {
    data = parsed;
  } else {
    console.error('  ✗ Unexpected WEB JSON format');
    return verses;
  }

  for (const entry of data) {
    const bookName = getBookNameById(entry.b);
    const text = (typeof entry.t === 'string' ? entry.t : String(entry.t ?? '')).trim();
    if (!text) continue;

    verses.push({
      translation: 'WEB',
      book: bookName,
      chapter: entry.c,
      verse: entry.v,
      text,
    });
  }

  console.log(`  ✓ Parsed ${verses.length} WEB verses`);
  return verses;
}

export function saveWEB(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const verses = parseWEB();
  writeFileSync(join(OUT_DIR, 'web.json'), JSON.stringify(verses));
  console.log(`  ✓ Saved to ${join(OUT_DIR, 'web.json')}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  saveWEB();
}
