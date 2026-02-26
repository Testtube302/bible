import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { NormalizedVerse } from './types.js';
import { BIBLE_BOOKS } from './utils.js';

const RAW_DIR = join(import.meta.dirname, '..', 'data', 'raw', 'asv');
const OUT_DIR = join(import.meta.dirname, '..', 'data', 'normalized');

// scrollmapper t_asv.json: same format as WEB
interface ScrollmapperVerse {
  id: number;
  b: number;
  c: number;
  v: number;
  t: string;
}

function getBookNameById(bookId: number): string {
  const book = BIBLE_BOOKS.find(b => b.order === bookId);
  return book?.name ?? `Book${bookId}`;
}

export function parseASV(): NormalizedVerse[] {
  console.log('\n📝 Parsing ASV...');
  const verses: NormalizedVerse[] = [];

  const filePath = join(RAW_DIR, 'asv.json');
  if (!existsSync(filePath)) {
    console.error('  ✗ asv.json not found. Run download first.');
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
    console.error('  ✗ Unexpected ASV JSON format');
    return verses;
  }

  for (const entry of data) {
    const bookName = getBookNameById(entry.b);
    const text = (typeof entry.t === 'string' ? entry.t : String(entry.t ?? '')).trim();
    if (!text) continue;

    verses.push({
      translation: 'ASV',
      book: bookName,
      chapter: entry.c,
      verse: entry.v,
      text,
    });
  }

  console.log(`  ✓ Parsed ${verses.length} ASV verses`);
  return verses;
}

export function saveASV(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const verses = parseASV();
  writeFileSync(join(OUT_DIR, 'asv.json'), JSON.stringify(verses));
  console.log(`  ✓ Saved to ${join(OUT_DIR, 'asv.json')}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  saveASV();
}
