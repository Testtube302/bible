import { OT_BOOKS, NT_BOOKS } from './constants';

const ALL_BOOKS = [...OT_BOOKS, ...NT_BOOKS];

const ABBREVIATIONS: Record<string, string> = {
  gen: 'Genesis', ex: 'Exodus', exo: 'Exodus', lev: 'Leviticus',
  num: 'Numbers', deut: 'Deuteronomy', dt: 'Deuteronomy',
  josh: 'Joshua', judg: 'Judges', jdg: 'Judges',
  '1 sam': '1 Samuel', '2 sam': '2 Samuel',
  '1sam': '1 Samuel', '2sam': '2 Samuel',
  '1 ki': '1 Kings', '2 ki': '2 Kings',
  '1ki': '1 Kings', '2ki': '2 Kings',
  '1 chr': '1 Chronicles', '2 chr': '2 Chronicles',
  '1chr': '1 Chronicles', '2chr': '2 Chronicles',
  neh: 'Nehemiah', est: 'Esther',
  ps: 'Psalms', psa: 'Psalms', psalm: 'Psalms',
  prov: 'Proverbs', pro: 'Proverbs',
  ecc: 'Ecclesiastes', eccl: 'Ecclesiastes',
  song: 'Song of Solomon', sos: 'Song of Solomon',
  isa: 'Isaiah', jer: 'Jeremiah', lam: 'Lamentations',
  ezek: 'Ezekiel', eze: 'Ezekiel', dan: 'Daniel',
  hos: 'Hosea', ob: 'Obadiah', oba: 'Obadiah',
  mic: 'Micah', nah: 'Nahum', hab: 'Habakkuk',
  zeph: 'Zephaniah', hag: 'Haggai', zech: 'Zechariah',
  mal: 'Malachi',
  matt: 'Matthew', mat: 'Matthew', mt: 'Matthew',
  mk: 'Mark', lk: 'Luke', jn: 'John', joh: 'John',
  rom: 'Romans',
  '1 cor': '1 Corinthians', '2 cor': '2 Corinthians',
  '1cor': '1 Corinthians', '2cor': '2 Corinthians',
  gal: 'Galatians', eph: 'Ephesians', phil: 'Philippians',
  col: 'Colossians',
  '1 thess': '1 Thessalonians', '2 thess': '2 Thessalonians',
  '1thess': '1 Thessalonians', '2thess': '2 Thessalonians',
  '1 tim': '1 Timothy', '2 tim': '2 Timothy',
  '1tim': '1 Timothy', '2tim': '2 Timothy',
  tit: 'Titus', phm: 'Philemon', philem: 'Philemon',
  heb: 'Hebrews', jas: 'James', jam: 'James',
  '1 pet': '1 Peter', '2 pet': '2 Peter',
  '1pet': '1 Peter', '2pet': '2 Peter',
  '1 jn': '1 John', '2 jn': '2 John', '3 jn': '3 John',
  '1jn': '1 John', '2jn': '2 John', '3jn': '3 John',
  '1 john': '1 John', '2 john': '2 John', '3 john': '3 John',
  rev: 'Revelation',
};

export interface ParsedReference {
  type: 'book' | 'chapter' | 'verse';
  bookName: string;
  chapter?: number;
  verse?: number;
}

function resolveBookName(input: string): string | null {
  const lower = input.toLowerCase().trim();

  // Check abbreviations first (longest match)
  const abbrevKeys = Object.keys(ABBREVIATIONS).sort((a, b) => b.length - a.length);
  for (const abbr of abbrevKeys) {
    if (lower === abbr) return ABBREVIATIONS[abbr];
  }

  // Exact match
  const exact = ALL_BOOKS.find(b => b.toLowerCase() === lower);
  if (exact) return exact;

  // Prefix match
  const prefix = ALL_BOOKS.find(b => b.toLowerCase().startsWith(lower));
  if (prefix) return prefix;

  return null;
}

export function parseBibleReference(input: string): ParsedReference | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\d?\s?[a-zA-Z\s]+?)(?:\s+(\d+))?(?:\s*[:\.]\s*(\d+))?$/);
  if (!match) return null;

  const bookPart = match[1].trim();
  const chapterPart = match[2];
  const versePart = match[3];

  const bookName = resolveBookName(bookPart);
  if (!bookName) return null;

  if (versePart && chapterPart) {
    return { type: 'verse', bookName, chapter: parseInt(chapterPart, 10), verse: parseInt(versePart, 10) };
  }
  if (chapterPart) {
    return { type: 'chapter', bookName, chapter: parseInt(chapterPart, 10) };
  }
  return { type: 'book', bookName };
}

export function getMatchingBooks(partial: string): string[] {
  const lower = partial.toLowerCase().trim();
  if (!lower) return [];

  const matches = new Set<string>();

  // Check abbreviations
  for (const [abbr, book] of Object.entries(ABBREVIATIONS)) {
    if (abbr.startsWith(lower)) matches.add(book);
  }

  // Check full names
  for (const book of ALL_BOOKS) {
    if (book.toLowerCase().startsWith(lower)) matches.add(book);
  }

  return Array.from(matches).slice(0, 8);
}
