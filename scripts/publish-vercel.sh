#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "[ERROR] Jalankan skrip dari dalam repository Git." >&2; exit 1;
}
cd "$ROOT"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "main" ]]; then
  echo "[ERROR] Branch aktif: $BRANCH. Pindah ke main terlebih dahulu." >&2
  exit 1
fi

VERSION="$(node -p "require('./package.json').version")"
if [[ "$VERSION" != "0.2.2" ]]; then
  echo "[ERROR] Versi package harus 0.2.2, ditemukan: $VERSION" >&2
  exit 1
fi

if grep -RInE 'import \{ db \} from ["\x27]@/lib/db|db\.query\(' app/api; then
  echo "[ERROR] Masih ada route yang menggunakan pola db Proxy lama." >&2
  exit 1
fi

grep -q 'export async function query' lib/db.ts || {
  echo "[ERROR] lib/db.ts belum menggunakan query() lazy function." >&2; exit 1;
}

if [[ -n "$(git status --porcelain)" ]]; then
  echo "[INFO] Ada perubahan source; membuat commit v0.2.2."
  git add -A
  git commit -m "fix: defer database access until route execution v0.2.2"
else
  echo "[INFO] Working tree bersih; membuat commit pemicu deployment."
  git commit --allow-empty -m "chore: trigger Vercel deployment v0.2.2"
fi

git push origin main
LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git ls-remote origin refs/heads/main | awk '{print $1}')"
if [[ "$LOCAL_SHA" != "$REMOTE_SHA" ]]; then
  echo "[ERROR] SHA remote tidak sama dengan lokal." >&2
  echo "local : $LOCAL_SHA" >&2
  echo "remote: $REMOTE_SHA" >&2
  exit 1
fi

echo
echo "[SUCCESS] Source v$VERSION sudah tersinkron ke origin/main."
echo "Commit: $LOCAL_SHA"
echo "Di Vercel, deployment baru harus menampilkan commit ini."
