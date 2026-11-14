import pg from 'pg';

const { Pool } = pg;
if (!process.env.DATABASE_URL) {
  console.error('[AR LIBRARY] DATABASE_URL belum diatur.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 10_000,
  application_name: 'arifi-razzaq-library-db-check',
  ssl: process.env.DATABASE_SSL === 'false' ? false : undefined,
});

try {
  const result = await pool.query(`
    SELECT
      current_database() IS NOT NULL AS connected,
      to_regclass('public.releases') IS NOT NULL AS releases,
      to_regclass('public.posts') IS NOT NULL AS posts
  `);
  const state = result.rows[0];
  if (!state.connected || !state.releases || !state.posts) {
    throw new Error('Koneksi berhasil tetapi tabel inti belum siap. Jalankan npm start atau npm run db:setup.');
  }
  console.log('[AR LIBRARY] DB CHECK OK — Neon reachable; tabel releases dan posts tersedia.');
} catch (error) {
  console.error('[AR LIBRARY] DB CHECK FAILED:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
