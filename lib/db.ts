import { Pool, type QueryResult, type QueryResultRow } from "pg";

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

// Export a plain function instead of a Proxy. Next.js may inspect imported
// module exports while collecting route configuration during `next build`.
// A Proxy can receive property reads during that phase and accidentally
// initialize the database before runtime. This function only calls getPool()
// when a request handler actually executes a query.
export async function query<R extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: unknown[],
): Promise<QueryResult<R>> {
  return getPool().query<R>(text, values as unknown[]);
}
