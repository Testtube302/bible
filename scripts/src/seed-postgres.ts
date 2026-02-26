import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import pg from 'pg';
import { BIBLE_BOOKS } from './utils.js';
import type { CrossReference } from './types.js';

const NORMALIZED_DIR = join(import.meta.dirname, '..', 'data', 'normalized');

function getPool(): pg.Pool {
  return new pg.Pool({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    database: process.env.POSTGRES_DB ?? 'bible',
    user: process.env.POSTGRES_USER ?? 'bible_user',
    password: process.env.POSTGRES_PASSWORD ?? 'bible_secure_pass_2024',
  });
}

async function seedBooks(pool: pg.Pool): Promise<void> {
  const existing = await pool.query('SELECT COUNT(*) FROM bible_books');
  if (parseInt(existing.rows[0].count, 10) > 0) {
    console.log(`  ✓ bible_books already seeded (${existing.rows[0].count} rows)`);
    return;
  }

  const query = `
    INSERT INTO bible_books (name, abbreviation, testament, book_order, chapter_count, verse_count)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT DO NOTHING
  `;

  for (const book of BIBLE_BOOKS) {
    await pool.query(query, [
      book.name, book.abbreviation, book.testament,
      book.order, book.chapterCount, book.totalVerses,
    ]);
  }

  console.log(`  ✓ Inserted ${BIBLE_BOOKS.length} books into bible_books`);
}

async function seedCrossRefs(pool: pg.Pool): Promise<void> {
  // Create table if it doesn't exist (for existing databases without this table)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cross_references (
      id              SERIAL PRIMARY KEY,
      from_book       VARCHAR(50) NOT NULL,
      from_chapter    INTEGER NOT NULL,
      from_verse      INTEGER NOT NULL,
      to_book         VARCHAR(50) NOT NULL,
      to_chapter      INTEGER NOT NULL,
      to_verse_start  INTEGER NOT NULL,
      to_verse_end    INTEGER NOT NULL,
      votes           INTEGER DEFAULT 0
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS idx_xref_from ON cross_references(from_book, from_chapter, from_verse)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_xref_to ON cross_references(to_book, to_chapter, to_verse_start)');

  const existing = await pool.query('SELECT COUNT(*) FROM cross_references');
  if (parseInt(existing.rows[0].count, 10) > 0) {
    console.log(`  ✓ cross_references already seeded (${existing.rows[0].count} rows)`);
    return;
  }

  const filePath = join(NORMALIZED_DIR, 'crossrefs.json');
  if (!existsSync(filePath)) {
    console.warn('  ⚠ crossrefs.json not found, skipping');
    return;
  }

  const refs: CrossReference[] = JSON.parse(readFileSync(filePath, 'utf-8'));
  console.log(`  📎 Inserting ${refs.length} cross-references...`);

  // Bulk insert in batches of 1000 using multi-row VALUES
  const BATCH = 1000;
  let inserted = 0;

  for (let i = 0; i < refs.length; i += BATCH) {
    const batch = refs.slice(i, i + BATCH);
    const values: any[] = [];
    const placeholders: string[] = [];

    for (let j = 0; j < batch.length; j++) {
      const r = batch[j];
      const offset = j * 8;
      placeholders.push(`($${offset+1}, $${offset+2}, $${offset+3}, $${offset+4}, $${offset+5}, $${offset+6}, $${offset+7}, $${offset+8})`);
      values.push(r.fromBook, r.fromChapter, r.fromVerse, r.toBook, r.toChapter, r.toVerseStart, r.toVerseEnd, r.votes);
    }

    await pool.query(
      `INSERT INTO cross_references (from_book, from_chapter, from_verse, to_book, to_chapter, to_verse_start, to_verse_end, votes)
       VALUES ${placeholders.join(', ')}`,
      values
    );

    inserted += batch.length;
    if (inserted % 50000 === 0 || inserted === refs.length) {
      console.log(`    ${inserted}/${refs.length} cross-references inserted`);
    }
  }

  console.log(`  ✓ Inserted ${inserted} cross-references`);
}

export async function seedPostgres(): Promise<void> {
  console.log('\n🗄️  Seeding PostgreSQL...');

  const pool = getPool();

  try {
    await seedBooks(pool);
    await seedCrossRefs(pool);
  } catch (err) {
    console.error('  ✗ PostgreSQL seeding failed:', err);
    throw err;
  } finally {
    await pool.end();
  }

  console.log('\n✅ PostgreSQL seeding complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedPostgres().catch(console.error);
}
