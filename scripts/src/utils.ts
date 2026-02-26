import type { NormalizedBook, Testament } from './types.js';

export const BIBLE_BOOKS: NormalizedBook[] = [
  // Old Testament
  { name: 'Genesis', abbreviation: 'Gen', testament: 'OT', order: 1, chapterCount: 50, totalVerses: 1533 },
  { name: 'Exodus', abbreviation: 'Exod', testament: 'OT', order: 2, chapterCount: 40, totalVerses: 1213 },
  { name: 'Leviticus', abbreviation: 'Lev', testament: 'OT', order: 3, chapterCount: 27, totalVerses: 859 },
  { name: 'Numbers', abbreviation: 'Num', testament: 'OT', order: 4, chapterCount: 36, totalVerses: 1288 },
  { name: 'Deuteronomy', abbreviation: 'Deut', testament: 'OT', order: 5, chapterCount: 34, totalVerses: 959 },
  { name: 'Joshua', abbreviation: 'Josh', testament: 'OT', order: 6, chapterCount: 24, totalVerses: 658 },
  { name: 'Judges', abbreviation: 'Judg', testament: 'OT', order: 7, chapterCount: 21, totalVerses: 618 },
  { name: 'Ruth', abbreviation: 'Ruth', testament: 'OT', order: 8, chapterCount: 4, totalVerses: 85 },
  { name: '1 Samuel', abbreviation: '1Sam', testament: 'OT', order: 9, chapterCount: 31, totalVerses: 810 },
  { name: '2 Samuel', abbreviation: '2Sam', testament: 'OT', order: 10, chapterCount: 24, totalVerses: 695 },
  { name: '1 Kings', abbreviation: '1Kgs', testament: 'OT', order: 11, chapterCount: 22, totalVerses: 816 },
  { name: '2 Kings', abbreviation: '2Kgs', testament: 'OT', order: 12, chapterCount: 25, totalVerses: 719 },
  { name: '1 Chronicles', abbreviation: '1Chr', testament: 'OT', order: 13, chapterCount: 29, totalVerses: 942 },
  { name: '2 Chronicles', abbreviation: '2Chr', testament: 'OT', order: 14, chapterCount: 36, totalVerses: 822 },
  { name: 'Ezra', abbreviation: 'Ezra', testament: 'OT', order: 15, chapterCount: 10, totalVerses: 280 },
  { name: 'Nehemiah', abbreviation: 'Neh', testament: 'OT', order: 16, chapterCount: 13, totalVerses: 406 },
  { name: 'Esther', abbreviation: 'Esth', testament: 'OT', order: 17, chapterCount: 10, totalVerses: 167 },
  { name: 'Job', abbreviation: 'Job', testament: 'OT', order: 18, chapterCount: 42, totalVerses: 1070 },
  { name: 'Psalms', abbreviation: 'Ps', testament: 'OT', order: 19, chapterCount: 150, totalVerses: 2461 },
  { name: 'Proverbs', abbreviation: 'Prov', testament: 'OT', order: 20, chapterCount: 31, totalVerses: 915 },
  { name: 'Ecclesiastes', abbreviation: 'Eccl', testament: 'OT', order: 21, chapterCount: 12, totalVerses: 222 },
  { name: 'Song of Solomon', abbreviation: 'Song', testament: 'OT', order: 22, chapterCount: 8, totalVerses: 117 },
  { name: 'Isaiah', abbreviation: 'Isa', testament: 'OT', order: 23, chapterCount: 66, totalVerses: 1292 },
  { name: 'Jeremiah', abbreviation: 'Jer', testament: 'OT', order: 24, chapterCount: 52, totalVerses: 1364 },
  { name: 'Lamentations', abbreviation: 'Lam', testament: 'OT', order: 25, chapterCount: 5, totalVerses: 154 },
  { name: 'Ezekiel', abbreviation: 'Ezek', testament: 'OT', order: 26, chapterCount: 48, totalVerses: 1273 },
  { name: 'Daniel', abbreviation: 'Dan', testament: 'OT', order: 27, chapterCount: 12, totalVerses: 357 },
  { name: 'Hosea', abbreviation: 'Hos', testament: 'OT', order: 28, chapterCount: 14, totalVerses: 197 },
  { name: 'Joel', abbreviation: 'Joel', testament: 'OT', order: 29, chapterCount: 3, totalVerses: 73 },
  { name: 'Amos', abbreviation: 'Amos', testament: 'OT', order: 30, chapterCount: 9, totalVerses: 146 },
  { name: 'Obadiah', abbreviation: 'Obad', testament: 'OT', order: 31, chapterCount: 1, totalVerses: 21 },
  { name: 'Jonah', abbreviation: 'Jonah', testament: 'OT', order: 32, chapterCount: 4, totalVerses: 48 },
  { name: 'Micah', abbreviation: 'Mic', testament: 'OT', order: 33, chapterCount: 7, totalVerses: 105 },
  { name: 'Nahum', abbreviation: 'Nah', testament: 'OT', order: 34, chapterCount: 3, totalVerses: 47 },
  { name: 'Habakkuk', abbreviation: 'Hab', testament: 'OT', order: 35, chapterCount: 3, totalVerses: 56 },
  { name: 'Zephaniah', abbreviation: 'Zeph', testament: 'OT', order: 36, chapterCount: 3, totalVerses: 53 },
  { name: 'Haggai', abbreviation: 'Hag', testament: 'OT', order: 37, chapterCount: 2, totalVerses: 38 },
  { name: 'Zechariah', abbreviation: 'Zech', testament: 'OT', order: 38, chapterCount: 14, totalVerses: 211 },
  { name: 'Malachi', abbreviation: 'Mal', testament: 'OT', order: 39, chapterCount: 4, totalVerses: 55 },
  // New Testament
  { name: 'Matthew', abbreviation: 'Matt', testament: 'NT', order: 40, chapterCount: 28, totalVerses: 1071 },
  { name: 'Mark', abbreviation: 'Mark', testament: 'NT', order: 41, chapterCount: 16, totalVerses: 678 },
  { name: 'Luke', abbreviation: 'Luke', testament: 'NT', order: 42, chapterCount: 24, totalVerses: 1151 },
  { name: 'John', abbreviation: 'John', testament: 'NT', order: 43, chapterCount: 21, totalVerses: 879 },
  { name: 'Acts', abbreviation: 'Acts', testament: 'NT', order: 44, chapterCount: 28, totalVerses: 1007 },
  { name: 'Romans', abbreviation: 'Rom', testament: 'NT', order: 45, chapterCount: 16, totalVerses: 433 },
  { name: '1 Corinthians', abbreviation: '1Cor', testament: 'NT', order: 46, chapterCount: 16, totalVerses: 437 },
  { name: '2 Corinthians', abbreviation: '2Cor', testament: 'NT', order: 47, chapterCount: 13, totalVerses: 257 },
  { name: 'Galatians', abbreviation: 'Gal', testament: 'NT', order: 48, chapterCount: 6, totalVerses: 149 },
  { name: 'Ephesians', abbreviation: 'Eph', testament: 'NT', order: 49, chapterCount: 6, totalVerses: 155 },
  { name: 'Philippians', abbreviation: 'Phil', testament: 'NT', order: 50, chapterCount: 4, totalVerses: 104 },
  { name: 'Colossians', abbreviation: 'Col', testament: 'NT', order: 51, chapterCount: 4, totalVerses: 95 },
  { name: '1 Thessalonians', abbreviation: '1Thess', testament: 'NT', order: 52, chapterCount: 5, totalVerses: 89 },
  { name: '2 Thessalonians', abbreviation: '2Thess', testament: 'NT', order: 53, chapterCount: 3, totalVerses: 47 },
  { name: '1 Timothy', abbreviation: '1Tim', testament: 'NT', order: 54, chapterCount: 6, totalVerses: 113 },
  { name: '2 Timothy', abbreviation: '2Tim', testament: 'NT', order: 55, chapterCount: 4, totalVerses: 83 },
  { name: 'Titus', abbreviation: 'Titus', testament: 'NT', order: 56, chapterCount: 3, totalVerses: 46 },
  { name: 'Philemon', abbreviation: 'Phlm', testament: 'NT', order: 57, chapterCount: 1, totalVerses: 25 },
  { name: 'Hebrews', abbreviation: 'Heb', testament: 'NT', order: 58, chapterCount: 13, totalVerses: 303 },
  { name: 'James', abbreviation: 'Jas', testament: 'NT', order: 59, chapterCount: 5, totalVerses: 108 },
  { name: '1 Peter', abbreviation: '1Pet', testament: 'NT', order: 60, chapterCount: 5, totalVerses: 105 },
  { name: '2 Peter', abbreviation: '2Pet', testament: 'NT', order: 61, chapterCount: 3, totalVerses: 61 },
  { name: '1 John', abbreviation: '1John', testament: 'NT', order: 62, chapterCount: 5, totalVerses: 105 },
  { name: '2 John', abbreviation: '2John', testament: 'NT', order: 63, chapterCount: 1, totalVerses: 13 },
  { name: '3 John', abbreviation: '3John', testament: 'NT', order: 64, chapterCount: 1, totalVerses: 15 },
  { name: 'Jude', abbreviation: 'Jude', testament: 'NT', order: 65, chapterCount: 1, totalVerses: 25 },
  { name: 'Revelation', abbreviation: 'Rev', testament: 'NT', order: 66, chapterCount: 22, totalVerses: 404 },
];

export function generateVerseId(translation: string, book: string, chapter: number, verse: number): string {
  const safeBook = book.replace(/\s+/g, '_');
  return `${translation}_${safeBook}_${chapter}_${verse}`;
}

export function getBookByName(name: string): NormalizedBook | undefined {
  const normalized = name.trim();
  return BIBLE_BOOKS.find(
    b => b.name.toLowerCase() === normalized.toLowerCase() ||
         b.abbreviation.toLowerCase() === normalized.toLowerCase()
  );
}

export function getTestament(bookName: string): Testament {
  const book = getBookByName(bookName);
  return book?.testament ?? 'OT';
}

export function getBookOrder(bookName: string): number {
  const book = getBookByName(bookName);
  return book?.order ?? 0;
}

// Maps various book name formats to canonical names
const BOOK_NAME_ALIASES: Record<string, string> = {
  'genesis': 'Genesis', 'gen': 'Genesis',
  'exodus': 'Exodus', 'exod': 'Exodus', 'exo': 'Exodus',
  'leviticus': 'Leviticus', 'lev': 'Leviticus',
  'numbers': 'Numbers', 'num': 'Numbers',
  'deuteronomy': 'Deuteronomy', 'deut': 'Deuteronomy', 'deu': 'Deuteronomy',
  'joshua': 'Joshua', 'josh': 'Joshua', 'jos': 'Joshua',
  'judges': 'Judges', 'judg': 'Judges', 'jdg': 'Judges',
  'ruth': 'Ruth', 'rut': 'Ruth',
  '1samuel': '1 Samuel', '1sam': '1 Samuel', '1 samuel': '1 Samuel', 'i samuel': '1 Samuel', '1sa': '1 Samuel',
  '2samuel': '2 Samuel', '2sam': '2 Samuel', '2 samuel': '2 Samuel', 'ii samuel': '2 Samuel', '2sa': '2 Samuel',
  '1kings': '1 Kings', '1kgs': '1 Kings', '1 kings': '1 Kings', 'i kings': '1 Kings', '1ki': '1 Kings',
  '2kings': '2 Kings', '2kgs': '2 Kings', '2 kings': '2 Kings', 'ii kings': '2 Kings', '2ki': '2 Kings',
  '1chronicles': '1 Chronicles', '1chr': '1 Chronicles', '1 chronicles': '1 Chronicles', 'i chronicles': '1 Chronicles', '1ch': '1 Chronicles',
  '2chronicles': '2 Chronicles', '2chr': '2 Chronicles', '2 chronicles': '2 Chronicles', 'ii chronicles': '2 Chronicles', '2ch': '2 Chronicles',
  'ezra': 'Ezra', 'ezr': 'Ezra',
  'nehemiah': 'Nehemiah', 'neh': 'Nehemiah',
  'esther': 'Esther', 'esth': 'Esther', 'est': 'Esther',
  'job': 'Job',
  'psalms': 'Psalms', 'psalm': 'Psalms', 'ps': 'Psalms', 'psa': 'Psalms',
  'proverbs': 'Proverbs', 'prov': 'Proverbs', 'pro': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes', 'eccl': 'Ecclesiastes', 'ecc': 'Ecclesiastes',
  'song of solomon': 'Song of Solomon', 'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'songofsolomon': 'Song of Solomon', 'sng': 'Song of Solomon',
  'isaiah': 'Isaiah', 'isa': 'Isaiah',
  'jeremiah': 'Jeremiah', 'jer': 'Jeremiah',
  'lamentations': 'Lamentations', 'lam': 'Lamentations',
  'ezekiel': 'Ezekiel', 'ezek': 'Ezekiel', 'eze': 'Ezekiel',
  'daniel': 'Daniel', 'dan': 'Daniel',
  'hosea': 'Hosea', 'hos': 'Hosea',
  'joel': 'Joel', 'joe': 'Joel',
  'amos': 'Amos', 'amo': 'Amos',
  'obadiah': 'Obadiah', 'obad': 'Obadiah', 'oba': 'Obadiah',
  'jonah': 'Jonah', 'jon': 'Jonah',
  'micah': 'Micah', 'mic': 'Micah',
  'nahum': 'Nahum', 'nah': 'Nahum', 'nam': 'Nahum',
  'habakkuk': 'Habakkuk', 'hab': 'Habakkuk',
  'zephaniah': 'Zephaniah', 'zeph': 'Zephaniah', 'zep': 'Zephaniah',
  'haggai': 'Haggai', 'hag': 'Haggai',
  'zechariah': 'Zechariah', 'zech': 'Zechariah', 'zec': 'Zechariah',
  'malachi': 'Malachi', 'mal': 'Malachi',
  'matthew': 'Matthew', 'matt': 'Matthew', 'mat': 'Matthew',
  'mark': 'Mark', 'mrk': 'Mark', 'mar': 'Mark',
  'luke': 'Luke', 'luk': 'Luke',
  'john': 'John', 'jhn': 'John', 'joh': 'John',
  'acts': 'Acts', 'act': 'Acts',
  'romans': 'Romans', 'rom': 'Romans',
  '1corinthians': '1 Corinthians', '1cor': '1 Corinthians', '1 corinthians': '1 Corinthians', 'i corinthians': '1 Corinthians', '1co': '1 Corinthians',
  '2corinthians': '2 Corinthians', '2cor': '2 Corinthians', '2 corinthians': '2 Corinthians', 'ii corinthians': '2 Corinthians', '2co': '2 Corinthians',
  'galatians': 'Galatians', 'gal': 'Galatians',
  'ephesians': 'Ephesians', 'eph': 'Ephesians',
  'philippians': 'Philippians', 'phil': 'Philippians', 'php': 'Philippians',
  'colossians': 'Colossians', 'col': 'Colossians',
  '1thessalonians': '1 Thessalonians', '1thess': '1 Thessalonians', '1 thessalonians': '1 Thessalonians', 'i thessalonians': '1 Thessalonians', '1th': '1 Thessalonians',
  '2thessalonians': '2 Thessalonians', '2thess': '2 Thessalonians', '2 thessalonians': '2 Thessalonians', 'ii thessalonians': '2 Thessalonians', '2th': '2 Thessalonians',
  '1timothy': '1 Timothy', '1tim': '1 Timothy', '1 timothy': '1 Timothy', 'i timothy': '1 Timothy', '1ti': '1 Timothy',
  '2timothy': '2 Timothy', '2tim': '2 Timothy', '2 timothy': '2 Timothy', 'ii timothy': '2 Timothy', '2ti': '2 Timothy',
  'titus': 'Titus', 'tit': 'Titus',
  'philemon': 'Philemon', 'phlm': 'Philemon', 'phm': 'Philemon',
  'hebrews': 'Hebrews', 'heb': 'Hebrews',
  'james': 'James', 'jas': 'James', 'jam': 'James',
  '1peter': '1 Peter', '1pet': '1 Peter', '1 peter': '1 Peter', 'i peter': '1 Peter', '1pe': '1 Peter',
  '2peter': '2 Peter', '2pet': '2 Peter', '2 peter': '2 Peter', 'ii peter': '2 Peter', '2pe': '2 Peter',
  '1john': '1 John', '1jn': '1 John', '1 john': '1 John', 'i john': '1 John', '1jo': '1 John',
  '2john': '2 John', '2jn': '2 John', '2 john': '2 John', 'ii john': '2 John', '2jo': '2 John',
  '3john': '3 John', '3jn': '3 John', '3 john': '3 John', 'iii john': '3 John', '3jo': '3 John',
  'jude': 'Jude', 'jud': 'Jude',
  'revelation': 'Revelation', 'rev': 'Revelation', 'revelations': 'Revelation',
};

export function normalizeBookName(input: string): string {
  const key = input.trim().toLowerCase().replace(/\s+/g, ' ');
  return BOOK_NAME_ALIASES[key] ?? BOOK_NAME_ALIASES[key.replace(/\s/g, '')] ?? input.trim();
}
