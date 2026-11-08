# Arifi Razzaq Official — Creator Library

**Versi: 0.2.0** · Next.js 16 · React 19 · TypeScript · PostgreSQL

Website katalog dan pusat informasi untuk konten channel **Arifi Razzaq Official**. Situs ini mengelompokkan project coding, bot, aplikasi, tools, tutorial, dan pembaruan dalam halaman detail yang mempunyai informasi versi, changelog, video terkait, tautan unduhan, statistik komunitas, rating, dan komentar.

## Arah desain v0.2.0

Antarmuka diperbarui dari dark/gold yang kontras menjadi tampilan **soft professional**: dasar off-white, permukaan putih, aksen sage yang diredam, border halus, radius konsisten, dan bayangan tipis. Tidak ada dependency font atau UI eksternal untuk tampilan utama. Layout desktop, tablet, dan ponsel memiliki komposisi berbeda agar kartu, filter, detail, dan panel admin tetap mudah dipakai.

## Fitur

- Homepage berbahasa Indonesia dengan identitas Arifi Razzaq Official dan tautan channel YouTube.
- Library publik dengan pencarian judul, deskripsi, versi, slug, dan tags.
- Filter kategori serta urutkan konten berdasarkan terbaru, download, likes, atau rating.
- Kartu rilis responsif, featured marker, cover thumbnail, versi, ukuran file, dan statistik.
- Detail rilis: deskripsi, versi, kategori, nama dan ukuran file, tags, changelog, video YouTube, serta tombol download.
- Like dan rating 1–5 per browser cookie anonim.
- Komentar publik dan moderasi hapus komentar dari Creator Studio.
- Creator Studio: login admin, tambah rilis, edit rilis, hapus rilis, statistik unduhan, dan moderasi komentar.
- Endpoint download mencatat permintaan dan mengarahkan pengunjung ke URL file eksternal.
- PostgreSQL sebagai penyimpanan permanen.

## Jalankan lokal

Persyaratan: Node.js 22.16+, npm 10+, dan PostgreSQL 15+.

```bash
# 1. Ekstrak ZIP, kemudian masuk ke folder proyek
cd arifi-razzaq-library

# 2. Siapkan konfigurasi; gunakan Neovim untuk mengedit
cp .env.example .env
nvim .env

# 3. Buat database kosong
createdb arifi_library

# 4. Pasang dependency dan buat schema awal
npm install
npm run db:setup

# 5. Jalankan server lokal
npm run dev
```

Buka `http://localhost:3000`. Creator Studio berada di `http://localhost:3000/admin`.

Isi `.env` dengan kredensial dan secret milik sendiri:

```dotenv
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/arifi_library
ADMIN_PASSWORD=YOUR_LONG_UNIQUE_ADMIN_PASSWORD
SESSION_SECRET=YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Buat secret sesi menggunakan `openssl rand -base64 48`. Jangan memakai nilai contoh atau commit file `.env`. Untuk database lokal non-SSL saja, `DATABASE_SSL=false` dapat diaktifkan.

## Workflow publikasi konten

1. Masuk ke `/admin`.
2. Isi judul, ringkasan, deskripsi, kategori, dan versi.
3. Masukkan URL file yang bisa diakses publik. Tambahkan URL video YouTube, thumbnail, tags, dan changelog bila tersedia.
4. Terbitkan. Konten akan muncul pada katalog publik.
5. Untuk pembaruan, tekan **Edit** pada item di Creator Studio. Ubah versi, detail, file URL, atau changelog lalu simpan.
6. Periksa halaman detail publik dan tombol unduhan setelah setiap publikasi.

## Struktur file penting

| Path | Fungsi |
|---|---|
| `app/page.tsx` | Landing page dan komposisi homepage |
| `app/globals.css` | Design system, responsive layout, detail, dan admin |
| `app/layout.tsx` | Metadata SEO, viewport, header dan footer global |
| `app/library/[slug]/page.tsx` | Route detail setiap rilis |
| `app/admin/page.tsx` | Route Creator Studio |
| `components/library-browser.tsx` | Search, kategori, sorting, dan kartu konten |
| `components/release-detail.tsx` | Detail rilis, download, like, rating, komentar |
| `components/admin-dashboard.tsx` | Form create/edit, statistik, dan moderasi |
| `app/api/releases/route.ts` | API list, pencarian, filter, sorting |
| `app/api/admin/releases/route.ts` | API tambah rilis |
| `app/api/admin/releases/[id]/route.ts` | API edit dan hapus rilis |
| `app/api/download/[slug]/route.ts` | Mencatat permintaan unduhan dan redirect |
| `db/schema.sql` | Tabel rilis, like, rating, dan komentar |
| `scripts/setup-db.mjs` | Menjalankan schema awal |
| `lib/auth.ts` | HMAC session admin |
| `lib/db.ts` | PostgreSQL connection pool |
| `docs/` | Arsitektur, setup, keamanan, QA, dan changelog |

## Perintah pengembangan

```bash
npm run dev       # server pengembangan
npm run lint      # ESLint
npm run typecheck # TypeScript check
npm run build     # production build
npm start         # jalankan hasil build
npm run db:setup  # schema awal PostgreSQL
```

## Deployment

Deploy sebagai aplikasi Next.js pada Vercel atau Node.js hosting yang mendukung Next.js. Siapkan PostgreSQL terkelola, masukkan environment variables ke hosting, lalu jalankan `db/schema.sql` satu kali atau `npm run db:setup` dari mesin yang dapat terhubung ke database. Konfigurasikan `NEXT_PUBLIC_SITE_URL` dengan domain final. Jangan mengandalkan filesystem deployment untuk menyimpan file yang diunggah.

Saat ini file konten masih disimpan pada layanan eksternal; website menyimpan URL, mencatat hit download, lalu melakukan redirect. Cloudflare R2 atau storage S3-compatible dapat ditambahkan pada fase berikutnya untuk alur upload langsung.

## Dokumentasi teknis

- [Arsitektur dan alur data](docs/ARCHITECTURE.md)
- [Setup dan workflow publikasi](docs/SETUP_AND_CONTENT_WORKFLOW.md)
- [Deployment, keamanan, dan operasi](docs/DEPLOYMENT_AND_SECURITY.md)
- [QA, batasan, dan changelog](docs/QA_AND_CHANGELOG.md)

## Status implementasi

**v0.2.0 — Soft Professional Redesign.** Source sudah diperbarui dan pemeriksaan sintaks statis dilakukan. Instalasi dependency terhenti karena registry tidak merespons dalam batas waktu sesi ini, sehingga `npm run lint`, `npm run typecheck` lengkap, `npm run build`, uji browser, dan integrasi PostgreSQL belum dapat dikonfirmasi. Lihat [QA_AND_CHANGELOG.md](docs/QA_AND_CHANGELOG.md) sebelum deploy.


## Latest hotfix — v0.2.1

This release fixes Vercel build-time failure caused by eager PostgreSQL initialization. Database connection creation is now lazy and occurs on the first database operation. See [QA and Changelog](docs/QA_AND_CHANGELOG.md) for details and deployment instructions. Ensure `DATABASE_URL` is configured in Vercel for the target environment before using database-backed features.
