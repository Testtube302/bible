/**
 * migrate-to-multiuser.ts
 *
 * Run after 004_user_auth.sql to:
 * 1. Create admin user from env vars
 * 2. Assign all existing data to admin user
 * 3. Set user_id columns to NOT NULL
 * 4. Create new UNIQUE constraints that include user_id
 *
 * Usage: docker compose exec -T backend npx tsx scripts/migrate-to-multiuser.ts
 */

import 'dotenv/config';
import pg from 'pg';
import { randomBytes, createHash } from 'crypto';

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  database: process.env.POSTGRES_DB ?? 'bible',
  user: process.env.POSTGRES_USER ?? 'bible_user',
  password: process.env.POSTGRES_PASSWORD,
});

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@scripture.app';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD env var is required');
    }

    // Hash password with pgcrypto (available in PostgreSQL)
    // We'll use a simple approach: generate bcrypt-compatible hash via Node crypto
    // Actually, since bcrypt isn't installed yet, use a SHA-256 based approach
    // that we'll verify works with the app. But the plan says to use bcrypt.
    // Let's dynamically import bcrypt if available, otherwise use a temp hash.

    let passwordHash: string;
    try {
      const bcrypt = await import('bcrypt');
      passwordHash = await bcrypt.hash(adminPassword, 12);
    } catch {
      // Fallback: use pgcrypto if bcrypt not yet installed
      const hashResult = await client.query(
        "SELECT gen_random_uuid()::text as id"
      );
      // Use a simple reversible marker — the app will use bcrypt at runtime
      // This script should be run AFTER npm install bcrypt
      console.error('WARNING: bcrypt not available. Install it first: npm install bcrypt');
      console.error('Run: cd /opt/bible/backend && npm install bcrypt @types/bcrypt');
      process.exit(1);
    }

    // Check if admin user already exists
    const existingAdmin = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    let adminId: string;
    if (existingAdmin.rows.length > 0) {
      adminId = existingAdmin.rows[0].id;
      console.log(`Admin user already exists: ${adminId}`);
    } else {
      const adminResult = await client.query(
        `INSERT INTO users (email, password_hash, display_name, role)
         VALUES ($1, $2, $3, 'admin')
         RETURNING id`,
        [adminEmail, passwordHash, 'Admin']
      );
      adminId = adminResult.rows[0].id;
      console.log(`Created admin user: ${adminId} (${adminEmail})`);
    }

    // Tables to update
    const tables = [
      'reading_progress',
      'reading_streaks',
      'bookmarks',
      'highlights',
      'chat_sessions',
      'plan_progress',
      'journey_progress',
      'quest_xp',
      'achievement_progress',
      'question_responses',
    ];

    // Assign orphaned rows to admin
    for (const table of tables) {
      const result = await client.query(
        `UPDATE ${table} SET user_id = $1 WHERE user_id IS NULL`,
        [adminId]
      );
      console.log(`${table}: assigned ${result.rowCount} rows to admin`);
    }

    // Set user_id to NOT NULL on all tables
    for (const table of tables) {
      await client.query(`ALTER TABLE ${table} ALTER COLUMN user_id SET NOT NULL`);
      console.log(`${table}: user_id set to NOT NULL`);
    }

    // Drop old UNIQUE constraints and create new ones including user_id

    // reading_progress: (book_name, chapter) → (user_id, book_name, chapter)
    await client.query(`
      ALTER TABLE reading_progress DROP CONSTRAINT IF EXISTS reading_progress_book_name_chapter_key
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS reading_progress_user_book_chapter_idx
      ON reading_progress(user_id, book_name, chapter)
    `);

    // reading_streaks: (date) → (user_id, date)
    await client.query(`
      ALTER TABLE reading_streaks DROP CONSTRAINT IF EXISTS reading_streaks_date_key
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS reading_streaks_user_date_idx
      ON reading_streaks(user_id, date)
    `);

    // bookmarks: (book_name, chapter, verse, translation) → (user_id, book_name, chapter, verse, translation)
    await client.query(`
      ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_book_name_chapter_verse_translation_key
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_book_chapter_verse_trans_idx
      ON bookmarks(user_id, book_name, chapter, verse, translation)
    `);

    // plan_progress: (plan_id) → (user_id, plan_id)
    await client.query(`
      ALTER TABLE plan_progress DROP CONSTRAINT IF EXISTS plan_progress_plan_id_key
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS plan_progress_user_plan_idx
      ON plan_progress(user_id, plan_id)
    `);

    // journey_progress: (journey_id) → (user_id, journey_id)
    await client.query(`
      ALTER TABLE journey_progress DROP CONSTRAINT IF EXISTS journey_progress_journey_id_key
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS journey_progress_user_journey_idx
      ON journey_progress(user_id, journey_id)
    `);

    // achievement_progress: (achievement_id) → (user_id, achievement_id)
    await client.query(`
      ALTER TABLE achievement_progress DROP CONSTRAINT IF EXISTS achievement_progress_achievement_id_key
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS achievement_progress_user_achievement_idx
      ON achievement_progress(user_id, achievement_id)
    `);

    // Create user_id indexes on all tables for query performance
    for (const table of tables) {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_${table}_user_id ON ${table}(user_id)
      `);
    }

    await client.query('COMMIT');
    console.log('\nMigration complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
