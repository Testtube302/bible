import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const RAW_DIR = join(import.meta.dirname, '..', 'data', 'raw');

export async function downloadCrossRefs(): Promise<void> {
  const dir = join(RAW_DIR, 'crossrefs');
  mkdirSync(dir, { recursive: true });

  console.log('\n🔗 Downloading cross-references...');

  // Cross-references are available as TSV from scrollmapper 2024 branch
  const tsvPath = join(dir, 'cross_references.txt');
  if (existsSync(tsvPath)) {
    console.log('  ✓ Cross-references (cached)');
  } else {
    const url = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/2024/cross_references.txt';
    try {
      console.log(`  Fetching: ${url}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      writeFileSync(tsvPath, text);
      console.log('  ✓ Cross-references downloaded (TSV)');
    } catch (err) {
      console.error(`  ✗ Cross-references: ${err}`);
    }
  }

  // Also download the key_english table for book ID mapping
  const keyPath = join(dir, 'key_english.json');
  if (!existsSync(keyPath)) {
    const keyUrl = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/2024/json/key_english.json';
    try {
      console.log(`  Fetching book key: ${keyUrl}`);
      const response = await fetch(keyUrl);
      if (response.ok) {
        const text = await response.text();
        writeFileSync(keyPath, text);
        console.log('  ✓ Book key downloaded');
      }
    } catch (err) {
      console.warn(`  ⚠ Book key: ${err}`);
    }
  }

  console.log('\n✅ Cross-reference download complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  downloadCrossRefs().catch(console.error);
}
