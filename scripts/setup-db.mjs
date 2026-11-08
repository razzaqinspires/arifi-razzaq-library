import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi koneksi PostgreSQL.');
  process.exit(1);
}

const schemaPath = fileURLToPath(new URL('../db/schema.sql', import.meta.url));
const schema = await readFile(path.resolve(schemaPath), 'utf8');
const pool = new Pool({ connectionString, max: 1 });
try {
  await pool.query(schema);
  console.log('[AR LIBRARY] Struktur database berhasil disiapkan.');
} catch (error) {
  console.error('[AR LIBRARY] Setup database gagal:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
