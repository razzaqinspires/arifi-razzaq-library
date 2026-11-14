import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('[AR LIBRARY] DATABASE_URL belum diatur. Hubungkan Neon dan masukkan pooled connection string ke .env.local atau environment Vercel.');
  process.exit(1);
}

if (!/^postgres(?:ql)?:\/\//i.test(connectionString)) {
  console.error('[AR LIBRARY] DATABASE_URL harus menggunakan skema postgres:// atau postgresql://.');
  process.exit(1);
}

const schemaPath = fileURLToPath(new URL('../db/schema.sql', import.meta.url));
const schema = await readFile(path.resolve(schemaPath), 'utf8');
const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 5_000,
  application_name: 'arifi-razzaq-library-schema-bootstrap',
  ssl: process.env.DATABASE_SSL === 'false' ? false : undefined,
});

let client;
try {
  client = await pool.connect();
  await client.query('SELECT 1');
  await client.query('BEGIN');
  // Serialize concurrent Vercel builds / local starts applying this idempotent schema.
  await client.query('SELECT pg_advisory_xact_lock($1::bigint)', ['724553901146']);
  await client.query(schema);
  await client.query('COMMIT');

  const verification = await client.query(`
    SELECT
      to_regclass('public.releases') IS NOT NULL AS releases,
      to_regclass('public.posts') IS NOT NULL AS posts,
      to_regclass('public.release_comments') IS NOT NULL AS release_comments,
      to_regclass('public.post_comments') IS NOT NULL AS post_comments
  `);
  const required = verification.rows[0];
  const missing = Object.entries(required).filter(([, exists]) => !exists).map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(`Verifikasi skema gagal; tabel belum tersedia: ${missing.join(', ')}`);
  }

  console.log('[AR LIBRARY] Neon PostgreSQL terhubung; skema dan seed idempotent terverifikasi.');
} catch (error) {
  if (client) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Keep the original migration/connection error as the primary failure.
    }
  }
  console.error('[AR LIBRARY] Database bootstrap gagal:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client?.release();
  await pool.end();
}
