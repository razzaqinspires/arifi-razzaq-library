# Arifi Razzaq — Worklog & Public Library

**Versi: 0.5.0** · Next.js 16 · React 19 · TypeScript · PostgreSQL

Ruang publik untuk mendokumentasikan karya digital, proses kerja, pembelajaran, eksperimen, dan diskusi komunitas. Website ini mengembangkan Creator Library awal menjadi ruang kerja publik yang mencakup empat area utama:

1. **Library** — source code, script, bot, aplikasi, tools, modifikasi buatan sendiri, dan berkas rilis yang memang siap dibagikan.
2. **Jurnal Kerja** — catatan pengembangan, eksperimen, troubleshooting, pembelajaran, serta proses di balik sebuah project.
3. **Ruang Komunitas** — post diskusi, pertanyaan, pertukaran pengalaman, dan komentar pembaca.
4. **Portfolio & Website Services** — portofolio proyek, starter website templates, dan konsultasi pengembangan website melalui WhatsApp Razzaq Ventures.

Konten publik tidak dimaksudkan sebagai salinan catatan internal bisnis. Jangan publikasikan modal, data pribadi, kredensial, token, password, konfigurasi privat, atau informasi pihak lain tanpa izin.

## Yang berubah pada v0.5.0

- Menjadikan `npm start` sebagai satu perintah startup lokal: memuat environment, memeriksa koneksi PostgreSQL, menerapkan skema idempotent dengan advisory lock, memverifikasi tabel, membuat production build jika belum ada, lalu menjalankan Next.js.
- Menjadikan `npm run dev` memakai bootstrap database yang sama sebelum menjalankan server pengembangan.
- Mengubah `npm run build` agar pada Vercel menjalankan bootstrap Neon PostgreSQL sebelum `next build`; build berhenti jika database tidak tersedia atau skema gagal disiapkan.
- Menambahkan endpoint health check `/api/health` dan perintah diagnostik `npm run db:check`.
- Mengoptimalkan pool PostgreSQL untuk fungsi serverless dengan satu koneksi per warm instance dan menganjurkan pooled Neon connection URI.
- Menambahkan `docs/AUTOMATED_STARTUP.md` untuk membedakan startup aplikasi dari provisioning infrastruktur Neon.
- Menegaskan bahwa `neon init` / `neon deploy` adalah langkah infrastruktur terotorisasi yang dijalankan sekali, bukan proses yang dipanggil pada setiap start atau request Vercel.

## Yang berubah pada v0.4.0

- Menambahkan portofolio dan rekam jejak proyek dengan label status yang membedakan website live dari software yang masih dikembangkan.
- Menambahkan konsultasi jasa pengembangan website Razzaq Ventures dengan tautan WhatsApp `+62 831-9390-5842`.
- Menambahkan katalog template Tour & Travel, Company Profile, dan Product Landing. Dua template HTML/CSS statis dapat dibuka offline dan dilihat melalui `/website-templates/index.html` (katalog), `/website-templates/company-profile/index.html`, dan `/website-templates/product-landing/index.html`.
- Menyimpan source HERU BALI TOUR pada `projects/client-work/heru-bali-tour/` beserta URL publiknya. Source tersebut adalah client work dan tidak otomatis berlisensi untuk penggunaan ulang.
- Mencatat WHISKAY-BOT, AISYAH × NEXORA, serta infrastruktur Vercel dan Neon.
- Menambahkan `docs/WORKLOG.md`, `docs/PORTFOLIO_AND_SERVICES.md`, `docs/NEON_SETUP.md`, dan `AGENTS.md`.
- Menambahkan skrip opsional `npm run neon:setup`; provisioning Neon memerlukan sesi autentikasi akun dan tidak dieksekusi otomatis saat build.
- Menyesuaikan `db:setup` agar membaca `.env` dan `.env.local`.

## Yang berubah pada v0.3.0

- Mempertahankan katalog file, halaman detail rilis, download tracking, like, rating, komentar, dan Creator Studio yang sudah ada.
- Menambahkan kategori luas untuk software, bot, web, AI, embedded/robotics/IoT, aplikasi, game modding, open source, tutorial, product development, creative work, dan worklog.
- Menambahkan **Jurnal Kerja** dan **Ruang Komunitas** sebagai jenis konten terpisah dari rilis yang bisa diunduh.
- Menambahkan post publik dengan kategori, tags, cover opsional, URL referensi, pilihan featured, status draft/publikasi, dan halaman detail.
- Menambahkan komentar di setiap post, serta moderasi komentar release dan post dalam Creator Studio.
- Menyediakan starter posts publik untuk memberi konteks awal: dokumentasi website, Razzaq Adzan Engine, eksperimen WhatsApp bot, embedded systems, eksplorasi AI, pengembangan produk, dan topik diskusi komunitas.
- Memperluas SEO metadata, navigasi, responsive UI, dan panduan publikasi.
- Tidak menambahkan dependency runtime baru.

## Struktur konten

| Area | Isi | URL |
|---|---|---|
| Library | Downloadable release, source code, tools, apps, scripts | `/` → Library |
| Jurnal Kerja | Worklog, riset, proses, pelajaran, eksperimen | `/` → Rekam kerja; detail `/posts/[slug]` |
| Ruang Komunitas | Pertanyaan dan diskusi berbasis post | `/` → Komunitas; detail `/posts/[slug]` |
| Creator Studio | Kelola release, post, draft, dan komentar | `/admin` |
| Portfolio & layanan | Karya, template website, konsultasi, dan sistem pendukung | `/#portfolio`, `/#templates`, `/#website-service`, `/#infrastructure` |

### Taksonomi Library

- Software & Coding
- Bot & Automation
- Web Development
- AI & Eksperimen
- Embedded, Robotics & IoT
- Aplikasi & Tools
- Game Modding
- Open Source
- Tutorial & Edukasi
- Product Development
- Creative & Content
- Worklog & Dokumentasi
- Riset & Eksperimen
- Lainnya

Kategori post memiliki cakupan yang serupa, dengan tambahan kategori Catatan Harian dan Diskusi Teknologi. Kategori lama tetap dapat diedit untuk menjaga kompatibilitas data existing.

## Jalankan lokal

Persyaratan: Node.js 22.16+, npm 10+, dan PostgreSQL 15+.

```bash
# Ekstrak ZIP lalu masuk ke folder proyek
cd arifi-razzaq-library

# Siapkan environment
cp .env.example .env
nvim .env
# Neon CLI may also write .env.local; keep both files private

# Install dependency
npm install

# Jalankan satu perintah; database disiapkan otomatis sebelum Next.js
npm run dev

# Untuk menjalankan production build lokal, lalu server production:
npm run build
npm start
```

Buka `http://localhost:3000`. Creator Studio berada di `http://localhost:3000/admin`.

Contoh konfigurasi `.env`:

```dotenv
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/arifi_library
ADMIN_PASSWORD=YOUR_LONG_UNIQUE_ADMIN_PASSWORD
SESSION_SECRET=YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Buat session secret menggunakan `openssl rand -base64 48`. Jangan commit file `.env`, password, session secret, API token, atau cookie. Untuk database lokal non-SSL saja, `DATABASE_SSL=false` dapat diaktifkan.

## Workflow publikasi

### Rilis Library

1. Masuk ke `/admin` lalu pilih tab **Library & file**.
2. Isi judul, ringkasan, deskripsi, kategori, versi, dan URL unduhan.
3. Tambahkan video, thumbnail, tags, dan changelog bila tersedia.
4. Pastikan file benar-benar milikmu atau lisensinya memperbolehkan distribusi ulang.
5. Terbitkan lalu periksa halaman detail dan tautan download.

### Jurnal Kerja dan Ruang Komunitas

1. Pilih tab **Jurnal & post**.
2. Pilih jenis **Jurnal Kerja**, **Ruang Komunitas / Diskusi**, atau **Pengumuman**.
3. Isi judul, ringkasan, isi post, kategori, dan tags.
4. Simpan sebagai draft dengan mematikan opsi publikasi, atau langsung publikasikan.
5. Halaman post memiliki ruang komentar. Komentar release dan komentar post dapat dimoderasi pada tab Komentar.

Gunakan Jurnal Kerja untuk proses yang sedang berlangsung maupun hasil yang sudah selesai. Jelaskan statusnya dengan jujur—misalnya *eksperimen*, *prototype*, *dalam pengembangan*, atau *rilis stabil*.

## Lisensi

Setiap item yang diterbitkan ke Library harus memiliki keterangan lisensi atau izin distribusi yang sesuai. Repository website ini belum menetapkan lisensi default; sebelum source website ini dibagikan ulang secara open-source, tentukan dan tambahkan file `LICENSE` yang sesuai. Jangan menganggap semua konten yang tampil di website otomatis berlisensi sama.

## Batas publikasi dan hak cipta

- Jangan masukkan rincian modal atau biaya internal, alamat atau data pribadi, nomor telepon privat, password, session, token, secret, akses server, dan dokumen bisnis internal.
- Jangan membagikan source code milik orang lain, APK/game binary proprietary, aset berbayar, lisensi, atau konten berhak cipta tanpa izin.
- Untuk konten game modding, utamakan patch, konfigurasi, tutorial, source mod, atau tautan sumber resmi yang legal. Jangan mengemas ulang dan mengedarkan file game/aset komersial tanpa hak distribusi.
- Beri kredit dan cantumkan lisensi sesuai ketentuan proyek sumber.
- Hindari klaim berlebihan pada riset eksperimental. Pisahkan hipotesis, pengamatan, hasil uji, dan kesimpulan.
- Post publik dapat dikomentari pembaca. Jangan mengunggah informasi sensitif pada komentar.

## Arsitektur singkat

- Next.js App Router: halaman publik, API routes, dan Creator Studio.
- PostgreSQL: tabel `releases` untuk materi unduhan; `posts` untuk jurnal/diskusi; `release_comments` dan `post_comments` untuk komentar; tabel likes/ratings untuk release.
- Cookie anonim untuk identitas visitor like/rating dan komentar; bukan sistem akun komunitas.
- Admin berbasis password dan HMAC-signed HTTP-only cookie.
- File rilis tetap di-host pada layanan eksternal; aplikasi menyimpan URL dan menghitung redirect download.
- Tidak ada binary storage maupun upload file langsung dalam versi ini.

## Database migration

v0.3.0 memperluas `db/schema.sql` dengan tabel `posts` dan `post_comments`, index, serta starter posts. Tidak ada tabel lama yang dihapus atau kolom rilis yang diubah. Untuk database existing, backup dahulu lalu jalankan:

```bash
npm run db:setup
```

Schema menggunakan `CREATE TABLE IF NOT EXISTS` dan starter posts memakai `ON CONFLICT (slug) DO NOTHING`, sehingga aman dijalankan ulang untuk setup tabel dan konten awal. Tetap lakukan backup sebelum perubahan database di production.

## Struktur file penting

| Path | Fungsi |
|---|---|
| `app/page.tsx` | Homepage, Library, Jurnal Kerja, dan Komunitas |
| `app/posts/[slug]/page.tsx` | Halaman detail post |
| `components/library-browser.tsx` | Katalog rilis dan filter kategori |
| `components/post-browser.tsx` | Feed jurnal, post komunitas, pencarian dan filter |
| `components/post-detail.tsx` | Konten post dan diskusi/komentar |
| `components/admin-dashboard.tsx` | CRUD release/post dan moderasi komentar |
| `app/api/posts/` | API post publik dan komentar |
| `app/api/admin/posts/` | API CRUD post khusus admin |
| `app/api/admin/post-comments/` | API moderasi komentar post |
| `db/schema.sql` | Schema release, post, engagement, dan komentar |
| `lib/content.ts` | Taksonomi kategori dan label jenis post |
| `lib/post-input.ts` | Sanitasi dan validasi input post |
| `docs/PUBLICATION_GUIDELINES.md` | Checklist publikasi dan praktik aman |

## Perintah

```bash
npm run dev        # bootstrap DB lalu jalankan server pengembangan
npm run build      # di Vercel: bootstrap DB lalu next build; lokal: next build
npm start          # bootstrap DB, build jika perlu, lalu jalankan server production lokal
npm run db:check   # uji koneksi dan tabel inti
npm run db:setup   # jalankan bootstrap skema secara manual
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run neon:setup # provisioning Neon sekali, dari terminal terotorisasi
npm run neon:status # tampilkan project/branch terhubung
```

Panduan satu-perintah dan alur Vercel: `docs/AUTOMATED_STARTUP.md`. Pada Vercel, platform memakai Build Command dan Node.js Functions; bukan proses `npm start` permanen. Pastikan `DATABASE_URL` production dan preview diatur pada Vercel sebelum deployment.


## Portfolio dan jasa website

Portofolio website, template, jasa konsultasi, dan infrastruktur ditampilkan pada homepage. HERU BALI TOUR tercatat sebagai website live yang diberikan oleh pemilik proyek. WHISKAY-BOT dan AISYAH × NEXORA tetap ditandai sebagai proyek pengembangan. Company Profile dan Product Landing adalah starter template, bukan klaim hasil proyek klien.

- Konsultasi website Razzaq Ventures: WhatsApp `+62 831-9390-5842`.
- HERU BALI TOUR live: <https://heru-bali-tour-website.vercel.app/>.
- Open templates: `website-templates/` (HTML/CSS, dapat dibuka offline).
- Source proyek klien: `projects/client-work/heru-bali-tour/` (tidak untuk distribusi ulang tanpa izin klien).

Lihat `docs/PORTFOLIO_AND_SERVICES.md` dan `docs/WORKLOG.md` untuk catatan lengkap.

## Neon database

Project Neon yang ditentukan pemilik dicatat di `docs/NEON_SETUP.md`. Provisioning Neon (`neon init` / `neon deploy`) tetap merupakan langkah infrastruktur satu kali dengan sesi akun terotorisasi. Setelah pooled `DATABASE_URL` dipasang di `.env.local` dan Vercel, `npm start` / `npm run dev` menyiapkan skema sebelum server lokal berjalan, sedangkan setiap Vercel build menyiapkan skema sebelum `next build`. Lihat `docs/AUTOMATED_STARTUP.md`. Jangan menyimpan database URI, kata sandi, atau API key ke repository.

## Status publikasi v0.5.0

Source Library telah diperbarui dan dikemas untuk ditinjau. Pembaruan ini belum dipublikasikan ke deployment website Library: konteks Vercel yang tersedia pada sesi ini tidak menampilkan team/project yang dapat diakses. Jangan menganggap perubahan pada arsip source otomatis sudah tampil di domain produksi.

## Deployment

Deploy di platform yang mendukung Next.js 16 dan PostgreSQL, misalnya Vercel dengan database terkelola. Atur `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, dan `NEXT_PUBLIC_SITE_URL` pada environment deployment. Untuk Neon, gunakan pooled PostgreSQL URI untuk route Node.js pada deployment serverless. Pada Vercel, `npm run build` menjalankan bootstrap skema otomatis dan membutuhkan `DATABASE_URL` yang valid; secara lokal, `npm start` atau `npm run dev` menjalankan bootstrap sebelum server aktif. Jangan mengandalkan filesystem deployment untuk menyimpan file unduhan.

## QA status

Status v0.5.0 dicatat di `docs/QA_AND_CHANGELOG.md`. Jangan menganggap deployment Neon, migration database, atau end-to-end test berhasil sebelum perintahnya dijalankan dan output-nya dicatat.
