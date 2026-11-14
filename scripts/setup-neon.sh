#!/usr/bin/env bash
set -Eeuo pipefail

# Neon project setup for Arifi Razzaq Library.
# Run only once from an authorized machine/account; never from Vercel runtime/build.

if [[ "${VERCEL:-}" == "1" ]]; then
  echo "[ERROR] Neon provisioning is an owner-authorized infrastructure step. Do not run neon init/deploy inside a Vercel build or runtime." >&2
  exit 1
fi

ORG_ID="org-gentle-smoke-00495930"
PROJECT_ID="bold-pond-23834459"
BRANCH="production"
SERVICES="postgres,auth,ai-gateway,object-storage,functions,realtime"

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm tidak ditemukan. Pasang Node.js/npm terlebih dahulu." >&2
  exit 1
fi

if ! command -v neon >/dev/null 2>&1; then
  echo "[INFO] Menginstal Neon CLI secara global..."
  if ! npm install -g neon@latest; then
    echo "[WARN] Instalasi global gagal; akan menggunakan npx neon@latest." >&2
  fi
fi

# Prefer the global CLI; fall back to npx when it is not on PATH.
neon_cmd() {
  if command -v neon >/dev/null 2>&1; then
    neon "$@"
  else
    npx --yes neon@latest "$@"
  fi
}

cd "$(dirname "$0")/.."
echo "[INFO] Menghubungkan Library ke Neon project ${PROJECT_ID}, branch ${BRANCH}."
echo "[INFO] Pastikan sesi akun aktif terlebih dahulu dengan 'neon auth'. Perintah init -y bersifat non-interaktif; jika belum terautentikasi, login tidak otomatis dimulai."
neon_cmd init -y \
  --org-id "$ORG_ID" \
  --project-id "$PROJECT_ID" \
  --branch "$BRANCH" \
  --services "$SERVICES"

echo "[INFO] Menjalankan provisioning dari konfigurasi Neon yang dihasilkan..."
neon_cmd deploy

echo "[NEXT] Periksa .env.local atau .env. Jangan pernah commit file tersebut."
echo "[NEXT] Setelah pooled DATABASE_URL tersedia, jalankan npm start. Perintah itu mem-bootstrap skema lalu menjalankan Next.js."
echo "[NEXT] Pada Vercel, masukkan DATABASE_URL untuk Production dan Preview; build Vercel akan mem-bootstrap database secara otomatis."
echo "[NEXT] Jalankan npm run lint dan npm run typecheck untuk validasi kode."
echo "[NEXT] Uji aplikasi serta setiap layanan yang benar-benar di-wire ke fitur aplikasi."
