import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2] === 'dev' ? 'dev' : 'start';
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');

if (!process.env.DATABASE_URL) {
  console.error('[AR LIBRARY] DATABASE_URL belum diatur. Buat .env.local dari .env.example dan isi koneksi Neon/PostgreSQL.');
  process.exit(1);
}

try {
  await access(nextBin);
} catch {
  console.error('[AR LIBRARY] Next.js belum terpasang. Jalankan npm install terlebih dahulu.');
  process.exit(1);
}

function runNext(args, label) {
  return new Promise((resolve, reject) => {
    console.log(`[AR LIBRARY] ${label}`);
    const child = spawn(process.execPath, [nextBin, ...args], {
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
  console.log(`[AR LIBRARY] Menyiapkan database sebelum Next.js ${mode}...`);
  const migration = spawn(process.execPath, [path.join(root, 'scripts', 'setup-db.mjs')], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
  const migrationExit = await new Promise((resolve, reject) => {
    migration.once('error', reject);
    migration.once('exit', (code, signal) => resolve(signal ? 1 : (code ?? 1)));
  });

  if (migrationExit !== 0) {
    throw new Error('Aplikasi tidak dijalankan karena database belum siap.');
  }

  process.env.NODE_ENV = mode === 'dev' ? 'development' : 'production';
  console.log('[AR LIBRARY] Database siap.');

  if (mode === 'start') {
    let hasBuild = true;
    try {
      await access(path.join(root, '.next', 'BUILD_ID'));
    } catch {
      hasBuild = false;
    }

    if (!hasBuild || process.env.ARIFI_REBUILD_ON_START === 'true') {
      await runNext(['build'], 'Production build belum tersedia atau diminta untuk dibuat ulang; membangun Next.js...');
    }
  }

  console.log(`[AR LIBRARY] Menjalankan Next.js ${mode}...`);
  const next = spawn(process.execPath, [nextBin, mode, ...process.argv.slice(3)], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => next.kill(signal));
  }

  next.once('error', (error) => {
    console.error('[AR LIBRARY] Next.js gagal dijalankan:', error.message);
    process.exitCode = 1;
  });
  next.once('exit', (code, signal) => {
    process.exitCode = signal ? 1 : (code ?? 1);
  });
} catch (error) {
  console.error('[AR LIBRARY] Startup dihentikan:', error instanceof Error ? error.message : error);
  process.exit(1);
}
