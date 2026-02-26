import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { BIBLE_BOOKS } from './utils.js';

const RAW_DIR = join(import.meta.dirname, '..', 'data', 'raw');

async function fetchJSON(url: string): Promise<any> {
  console.log(`  Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function fetchText(url: string): Promise<string> {
  console.log(`  Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

// KJV book name mapping for the aruljohn/Bible-kjv repo filenames
const KJV_FILE_NAMES: Record<string, string> = {
  'Genesis': 'Genesis', 'Exodus': 'Exodus', 'Leviticus': 'Leviticus',
  'Numbers': 'Numbers', 'Deuteronomy': 'Deuteronomy', 'Joshua': 'Joshua',
  'Judges': 'Judges', 'Ruth': 'Ruth', '1 Samuel': '1Samuel',
  '2 Samuel': '2Samuel', '1 Kings': '1Kings', '2 Kings': '2Kings',
  '1 Chronicles': '1Chronicles', '2 Chronicles': '2Chronicles',
  'Ezra': 'Ezra', 'Nehemiah': 'Nehemiah', 'Esther': 'Esther',
  'Job': 'Job', 'Psalms': 'Psalms', 'Proverbs': 'Proverbs',
  'Ecclesiastes': 'Ecclesiastes', 'Song of Solomon': 'SongofSolomon',
  'Isaiah': 'Isaiah', 'Jeremiah': 'Jeremiah', 'Lamentations': 'Lamentations',
  'Ezekiel': 'Ezekiel', 'Daniel': 'Daniel', 'Hosea': 'Hosea',
  'Joel': 'Joel', 'Amos': 'Amos', 'Obadiah': 'Obadiah',
  'Jonah': 'Jonah', 'Micah': 'Micah', 'Nahum': 'Nahum',
  'Habakkuk': 'Habakkuk', 'Zephaniah': 'Zephaniah', 'Haggai': 'Haggai',
  'Zechariah': 'Zechariah', 'Malachi': 'Malachi', 'Matthew': 'Matthew',
  'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John', 'Acts': 'Acts',
  'Romans': 'Romans', '1 Corinthians': '1Corinthians',
  '2 Corinthians': '2Corinthians', 'Galatians': 'Galatians',
  'Ephesians': 'Ephesians', 'Philippians': 'Philippians',
  'Colossians': 'Colossians', '1 Thessalonians': '1Thessalonians',
  '2 Thessalonians': '2Thessalonians', '1 Timothy': '1Timothy',
  '2 Timothy': '2Timothy', 'Titus': 'Titus', 'Philemon': 'Philemon',
  'Hebrews': 'Hebrews', 'James': 'James', '1 Peter': '1Peter',
  '2 Peter': '2Peter', '1 John': '1John', '2 John': '2John',
  '3 John': '3John', 'Jude': 'Jude', 'Revelation': 'Revelation',
};

async function downloadKJV(): Promise<void> {
  const dir = join(RAW_DIR, 'kjv');
  mkdirSync(dir, { recursive: true });

  console.log('\n📖 Downloading KJV Bible...');
  const baseUrl = 'https://raw.githubusercontent.com/aruljohn/Bible-kjv/master';

  for (const book of BIBLE_BOOKS) {
    const fileName = KJV_FILE_NAMES[book.name];
    if (!fileName) {
      console.warn(`  ⚠ No filename mapping for: ${book.name}`);
      continue;
    }

    const filePath = join(dir, `${fileName}.json`);
    if (existsSync(filePath)) {
      console.log(`  ✓ ${book.name} (cached)`);
      continue;
    }

    try {
      const data = await fetchJSON(`${baseUrl}/${fileName}.json`);
      writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  ✓ ${book.name}`);
    } catch (err) {
      console.error(`  ✗ ${book.name}: ${err}`);
    }
  }

  // Also download Books.json for reference
  try {
    const books = await fetchJSON(`${baseUrl}/Books.json`);
    writeFileSync(join(dir, 'Books.json'), JSON.stringify(books, null, 2));
  } catch (err) {
    console.warn(`  ⚠ Could not download Books.json: ${err}`);
  }
}

async function downloadWEB(): Promise<void> {
  const dir = join(RAW_DIR, 'web');
  mkdirSync(dir, { recursive: true });

  console.log('\n📖 Downloading WEB Bible...');

  const filePath = join(dir, 'web.json');

  if (existsSync(filePath)) {
    console.log('  ✓ WEB (cached)');
    return;
  }

  // scrollmapper 2024 branch (moved from master during repo restructure)
  const url = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/2024/json/t_web.json';
  try {
    const text = await fetchText(url);
    writeFileSync(filePath, text);
    console.log('  ✓ WEB downloaded');
  } catch (err) {
    console.error(`  ✗ WEB: ${err}`);
  }
}

async function downloadASV(): Promise<void> {
  const dir = join(RAW_DIR, 'asv');
  mkdirSync(dir, { recursive: true });

  console.log('\n📖 Downloading ASV Bible...');

  const filePath = join(dir, 'asv.json');
  if (existsSync(filePath)) {
    console.log('  ✓ ASV (cached)');
    return;
  }

  // scrollmapper 2024 branch (moved from master during repo restructure)
  const url = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/2024/json/t_asv.json';
  try {
    const text = await fetchText(url);
    writeFileSync(filePath, text);
    console.log('  ✓ ASV downloaded');
  } catch (err) {
    console.error(`  ✗ ASV: ${err}`);
  }
}

export async function downloadAllBibles(): Promise<void> {
  mkdirSync(RAW_DIR, { recursive: true });
  console.log('🔽 Starting Bible downloads...');
  console.log(`   Output: ${RAW_DIR}`);

  await downloadKJV();
  await downloadWEB();
  await downloadASV();

  console.log('\n✅ Bible downloads complete.');
}

// Run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  downloadAllBibles().catch(console.error);
}
