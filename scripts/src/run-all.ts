import 'dotenv/config';
import { downloadAllBibles } from './download-bibles.js';
import { downloadCrossRefs } from './download-crossrefs.js';
import { saveKJV } from './parse-kjv.js';
import { saveWEB } from './parse-web.js';
import { saveASV } from './parse-asv.js';
import { saveCrossRefs } from './parse-crossrefs.js';
import { ingestAll } from './ingest-chromadb.js';
import { seedPostgres } from './seed-postgres.js';

async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('═══════════════════════════════════════════');
  console.log('  Scripture Bible PWA — Data Ingestion');
  console.log('═══════════════════════════════════════════');

  // Phase 1: Download raw data
  console.log('\n━━━ PHASE 1: DOWNLOAD ━━━');
  await downloadAllBibles();
  await downloadCrossRefs();

  // Phase 2: Parse into normalized format
  console.log('\n━━━ PHASE 2: PARSE ━━━');
  try { saveKJV(); } catch (e) { console.error('  ✗ KJV parse failed:', e); }
  try { saveWEB(); } catch (e) { console.error('  ✗ WEB parse failed:', e); }
  try { saveASV(); } catch (e) { console.error('  ✗ ASV parse failed:', e); }
  try { saveCrossRefs(); } catch (e) { console.error('  ✗ Cross-refs parse failed:', e); }

  // Phase 3: Ingest into ChromaDB
  console.log('\n━━━ PHASE 3: CHROMADB INGESTION ━━━');
  await ingestAll();

  // Phase 4: Seed PostgreSQL
  console.log('\n━━━ PHASE 4: POSTGRESQL SEEDING ━━━');
  await seedPostgres();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n═══════════════════════════════════════════');
  console.log(`  ✅ All done! Completed in ${elapsed}s`);
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n❌ Ingestion failed:', err);
  process.exit(1);
});
