import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var creatorLibraryPool: Pool | undefined;
}

function getPool(): Pool {
  // Do not read DATABASE_URL or create a Pool at module-import time.
  // Next.js imports route modules during `next build`, when runtime
  // environment variables may intentionally be unavailable.
  if (global.creatorLibraryPool) return global.creatorLibraryPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL belum dikonfigurasi. Tambahkan DATABASE_URL pada environment deployment sebelum menggunakan API database.",
    );
  }

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: process.env.DATABASE_SSL === "false" ? false : undefined,
  });

  global.creatorLibraryPool = pool;
  return pool;
}

// Lazy proxy: importing this module is safe during build-time route analysis.
// Pool methods are bound to the real Pool instance when first accessed.
export const db = new Proxy({} as Pool, {
  get(_target, property) {
    const pool = getPool();
    const value = Reflect.get(pool, property, pool) as unknown;
    return typeof value === "function" ? value.bind(pool) : value;
  },
});
