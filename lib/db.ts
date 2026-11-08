import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var creatorLibraryPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL belum dikonfigurasi.");
  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: process.env.DATABASE_SSL === "false" ? false : undefined,
  });
}

export const db = global.creatorLibraryPool ?? createPool();
if (process.env.NODE_ENV !== "production") global.creatorLibraryPool = db;
