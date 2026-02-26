import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { CrossReference } from './types.js';

const RAW_DIR = join(import.meta.dirname, '..', 'data', 'raw', 'crossrefs');
const OUT_DIR = join(import.meta.dirname, '..', 'data', 'normalized');

// Map short book abbreviations from OpenBible.info format to full names
const BOOK_ABBREV_MAP: Record<string, string> = {
  'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers',
  'Deut': 'Deuteronomy', 'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth',
  '1Sam': '1 Samuel', '2Sam': '2 Samuel', '1Kgs': '1 Kings', '2Kgs': '2 Kings',
  '1Chr': '1 Chronicles', '2Chr': '2 Chronicles', 'Ezra': 'Ezra', 'Neh': 'Nehemiah',
  'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms', 'Prov': 'Proverbs',
  'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
  'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
  'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah',
  'Jonah': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk',
  'Zeph': 'Zephaniah', 'Hag': 'Haggai', 'Zech': 'Zechariah', 'Mal': 'Malachi',
  'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John',
  'Acts': 'Acts', 'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians',
  'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians',
  '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy',
  '2Tim': '2 Timothy', 'Titus': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews',
  'Jas': 'James', '1Pet': '1 Peter', '2Pet': '2 Peter', '1John': '1 John',
  '2John': '2 John', '3John': '3 John', 'Jude': 'Jude', 'Rev': 'Revelation',
};

function parseVerseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  // Format: "Gen.1.1" or "1Sam.2.3"
  const parts = ref.split('.');
  if (parts.length < 3) return null;

  const abbrev = parts[0];
  const chapter = parseInt(parts[1], 10);
  const verse = parseInt(parts[2], 10);

  const book = BOOK_ABBREV_MAP[abbrev];
  if (!book || isNaN(chapter) || isNaN(verse)) return null;

  return { book, chapter, verse };
}

export function parseCrossRefs(): CrossReference[] {
  console.log('\n🔗 Parsing cross-references...');
  const refs: CrossReference[] = [];

  // Try TSV format first (from scrollmapper 2024 branch)
  const tsvPath = join(RAW_DIR, 'cross_references.txt');
  if (!existsSync(tsvPath)) {
    console.error('  ✗ cross_references.txt not found. Run download first.');
    return refs;
  }

  const raw = readFileSync(tsvPath, 'utf-8');
  const lines = raw.split('\n');

  let skipped = 0;
  for (const line of lines) {
    if (!line.trim() || line.startsWith('From Verse') || line.startsWith('#')) continue;

    const parts = line.split('\t');
    if (parts.length < 3) { skipped++; continue; }

    const from = parseVerseRef(parts[0].trim());
    const to = parseVerseRef(parts[1].trim());
    const votes = parseInt(parts[2].trim(), 10) || 0;

    if (!from || !to) { skipped++; continue; }

    refs.push({
      fromBook: from.book,
      fromChapter: from.chapter,
      fromVerse: from.verse,
      toBook: to.book,
      toChapter: to.chapter,
      toVerseStart: to.verse,
      toVerseEnd: to.verse,
      votes,
    });
  }

  if (skipped > 0) console.log(`  ⚠ Skipped ${skipped} unparseable lines`);
  console.log(`  ✓ Parsed ${refs.length} cross-references`);
  return refs;
}

export function saveCrossRefs(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const refs = parseCrossRefs();
  writeFileSync(join(OUT_DIR, 'crossrefs.json'), JSON.stringify(refs));
  console.log(`  ✓ Saved to ${join(OUT_DIR, 'crossrefs.json')}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  saveCrossRefs();
}
