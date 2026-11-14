import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isVercel = process.env.ARIFI_VERCEL_BUILD === '1' || process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);

function runNodeScript(script, label, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`[AR LIBRARY] ${label}`);
    const child = spawn(process.execPath, [path.join(root, script), ...args], {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal || code !== 0) {
        reject(new Error(`${label} gagal (exit=${code ?? 'null'}, signal=${signal ?? 'none'}).`));
      } else {
        resolve();
      }
    });
  });
}

try {
  if (isVercel && process.env.ARIFI_DB_AUTO_MIGRATE !== 'false') {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL wajib tersedia pada Vercel Production dan Preview. Tambahkan pooled Neon connection string di Project Settings → Environment Variables.');
    }
    await runNodeScript('scripts/setup-db.mjs', 'Menyiapkan dan memverifikasi Neon PostgreSQL sebelum build Vercel...');
  } else if (isVercel) {
    console.warn('[AR LIBRARY] ARIFI_DB_AUTO_MIGRATE=false; migrasi otomatis dilewati sesuai konfigurasi.');
  } else {
    console.log('[AR LIBRARY] Build lokal: migrasi database tidak dijalankan. Gunakan npm start untuk bootstrap database dan menjalankan server.');
  }

  await runNodeScript('node_modules/next/dist/bin/next', 'Menjalankan Next.js production build...', ['build']);
} catch (error) {
  console.error('[AR LIBRARY] Build dihentikan:', error instanceof Error ? error.message : error);
  process.exit(1);
}
