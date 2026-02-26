import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ChromaClient } from 'chromadb';
import type { NormalizedVerse } from './types.js';
import { generateVerseId, getTestament, getBookOrder } from './utils.js';

const NORMALIZED_DIR = join(import.meta.dirname, '..', 'data', 'normalized');
const BATCH_SIZE = 250;

function getChromaHost(): string {
  return process.env.CHROMADB_HOST ?? 'localhost';
}

function getChromaPort(): number {
  return parseInt(process.env.CHROMADB_PORT ?? '8000', 10);
}

async function ingestVerses(client: ChromaClient): Promise<void> {
  console.log('\n📚 Ingesting Bible verses into ChromaDB...');

  const collection = await (client as any).getOrCreateCollection({
    name: 'bible_verses',
    metadata: { 'hnsw:space': 'cosine' },
  });

  for (const translation of ['kjv', 'web', 'asv'] as const) {
    const filePath = join(NORMALIZED_DIR, `${translation}.json`);
    if (!existsSync(filePath)) {
      console.warn(`  ⚠ ${translation}.json not found, skipping`);
      continue;
    }

    const verses: NormalizedVerse[] = JSON.parse(readFileSync(filePath, 'utf-8'));
    const translationUpper = translation.toUpperCase();
    console.log(`  📖 ${translationUpper}: ${verses.length} verses`);

    let ingested = 0;
    for (let i = 0; i < verses.length; i += BATCH_SIZE) {
      const batch = verses.slice(i, i + BATCH_SIZE);

      await collection.upsert({
        ids: batch.map(v => generateVerseId(v.translation, v.book, v.chapter, v.verse)),
        documents: batch.map(v => v.text),
        metadatas: batch.map(v => ({
          translation: v.translation,
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          testament: getTestament(v.book),
          book_order: getBookOrder(v.book),
        })),
      });

      ingested += batch.length;
      if (ingested % 5000 === 0 || ingested === verses.length) {
        console.log(`    ${translationUpper}: ${ingested}/${verses.length} verses ingested`);
      }
    }
  }

  const count = await collection.count();
  console.log(`  ✅ bible_verses collection: ${count} total documents`);
}

export async function ingestAll(): Promise<void> {
  const host = getChromaHost();
  const port = getChromaPort();
  console.log(`\n🔌 Connecting to ChromaDB at ${host}:${port}...`);

  const client = new ChromaClient({ path: `http://${host}:${port}` });

  // Verify connection
  const heartbeat = await client.heartbeat();
  console.log(`  ✓ ChromaDB connected (heartbeat: ${JSON.stringify(heartbeat)})`);

  // Only verses go into ChromaDB (semantic search).
  // Cross-references are relational data → PostgreSQL only.
  await ingestVerses(client);

  console.log('\n✅ ChromaDB ingestion complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ingestAll().catch(console.error);
}
