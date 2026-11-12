CREATE TABLE IF NOT EXISTS releases (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  short_description VARCHAR(280) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  version VARCHAR(60) NOT NULL,
  file_size VARCHAR(60),
  file_name VARCHAR(180),
  download_url TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  changelog TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  downloads BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS releases_created_at_idx ON releases (created_at DESC);
CREATE INDEX IF NOT EXISTS releases_category_idx ON releases (category);

CREATE TABLE IF NOT EXISTS release_likes (
  id BIGSERIAL PRIMARY KEY,
  release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (release_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS release_ratings (
  id BIGSERIAL PRIMARY KEY,
  release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (release_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS release_comments (
  id BIGSERIAL PRIMARY KEY,
  release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  name VARCHAR(48) NOT NULL,
  body VARCHAR(1200) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS release_comments_public_idx
  ON release_comments (release_id, created_at DESC) WHERE status = 'approved';

-- Editorial work logs and community posts are separate from downloadable releases.
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  excerpt VARCHAR(360) NOT NULL,
  content TEXT NOT NULL,
  kind VARCHAR(20) NOT NULL DEFAULT 'journal' CHECK (kind IN ('journal', 'community', 'announcement')),
  category VARCHAR(80) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover_image_url TEXT,
  external_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_published_created_idx ON posts (published, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_kind_category_idx ON posts (kind, category);

CREATE TABLE IF NOT EXISTS post_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  name VARCHAR(48) NOT NULL,
  body VARCHAR(1200) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS post_comments_public_idx
  ON post_comments (post_id, created_at DESC) WHERE status = 'approved';

-- Public launch content: useful context without exposing private operating costs or credentials.
INSERT INTO posts (title, slug, excerpt, content, kind, category, tags, featured, published)
VALUES
  (
    'Ruang Rekam Kerja: dokumentasi proses, bukan sekadar hasil',
    'ruang-rekam-kerja-dokumentasi-proses',
    'Catatan tentang tujuan website ini: menyimpan jejak belajar, eksperimen, proyek, dan karya yang layak dibagikan secara terbuka.',
    'Website ini dikembangkan sebagai perpustakaan publik sekaligus jurnal kerja digital. Isinya tidak hanya produk akhir, tetapi juga proses belajar, percobaan, perbaikan, dokumentasi, dan pelajaran yang didapat selama mengerjakan sesuatu.

Library digunakan untuk source code, aplikasi, tools, dan berkas rilis. Jurnal Kerja digunakan untuk mencatat proses pengembangan. Ruang Komunitas menjadi tempat bertukar pengalaman dan berdiskusi melalui post.

Yang dipublikasikan di sini adalah informasi yang memang pantas dibagikan kepada publik. Data pribadi, kredensial, rincian modal internal, serta informasi operasional yang sensitif tidak menjadi bagian dari arsip publik ini.',
    'journal', 'Worklog & Dokumentasi', ARRAY['worklog','dokumentasi','open knowledge'], TRUE, TRUE
  ),
  (
    'Razzaq Adzan Engine: belajar membangun software yang terstruktur',
    'razzaq-adzan-engine-software-terstruktur',
    'Catatan pengembangan proyek JavaScript ESM dengan fokus pada struktur modul, validasi, konsistensi, dan kualitas software.',
    'Razzaq Adzan Engine adalah salah satu proyek pengembangan software yang menjadi ruang belajar rekayasa perangkat lunak. Fokus pengerjaannya mencakup pemisahan modul, API yang konsisten, validasi input, penanganan kesalahan, dokumentasi, dan kesiapan untuk dikembangkan lebih lanjut.

Proyek ini dikerjakan dengan JavaScript berbasis ESM. Setiap iterasi menjadi kesempatan untuk memperbaiki struktur, memperjelas tanggung jawab modul, dan meningkatkan keandalan.

Catatan ini merupakan jurnal proses. Detail implementasi dan source code yang memang siap dibagikan akan ditempatkan pada bagian Library atau repositori publik terkait.',
    'journal', 'Software & Coding', ARRAY['javascript','esm','software engineering','adzan engine'], TRUE, TRUE
  ),
  (
    'Eksperimen WhatsApp Bot dan otomasi berbasis Node.js',
    'eksperimen-whatsapp-bot-nodejs',
    'Mencatat proses menyusun bot modular, event handler, plugin, dan automasi yang lebih mudah dirawat.',
    'Pengembangan bot bukan hanya tentang membuat perintah bisa berjalan. Struktur kode, pemisahan event, pengelolaan plugin, validasi pesan, dan penanganan kondisi gagal juga menentukan apakah sebuah bot mudah dirawat.

Dalam beberapa eksperimen, pendekatan yang dipelajari mencakup JavaScript ESM, pemetaan event, pemisahan fitur menjadi modul, serta perhatian pada penggunaan memori dan proses debugging.

Jurnal ini akan menjadi tempat mencatat pembelajaran dan pola implementasi yang aman dibagikan. Token, session, nomor pribadi, kredensial, dan konfigurasi server sensitif tidak akan dipublikasikan.',
    'journal', 'Bot & Automation', ARRAY['nodejs','whatsapp bot','automation','esm'], FALSE, TRUE
  ),
  (
    'Laboratorium Embedded: Arduino, ESP32, dan Raspberry Pi',
    'laboratorium-embedded-arduino-esp32',
    'Ruang belajar bertahap untuk mikrokontroler, sensor, elektronik, IoT, dan prototipe robotika.',
    'Eksplorasi embedded systems dimulai dari memahami dasar rangkaian, input dan output digital, sensor, komunikasi serial, serta cara perangkat lunak berinteraksi dengan perangkat keras.

Arduino, ESP32, dan Raspberry Pi memiliki karakter dan penggunaan yang berbeda. Catatan di sini akan mengumpulkan eksperimen, skema sederhana, potongan kode, hasil pengujian, dan kesalahan yang bisa menjadi pelajaran.

Targetnya adalah membangun pemahaman yang kuat sebelum melangkah ke proyek IoT dan robotika yang lebih kompleks. Setiap rangkaian akan didokumentasikan bersama catatan keselamatan dan batasan pengujian yang relevan.',
    'journal', 'Embedded, Robotics & IoT', ARRAY['arduino','esp32','raspberry pi','robotics','iot'], FALSE, TRUE
  ),
  (
    'Eksplorasi AI dan Metacognitive Nexus',
    'eksplorasi-ai-metacognitive-nexus',
    'Catatan riset terbuka tentang metakognisi pada sistem AI, dengan membedakan hipotesis, eksperimen, dan bukti.',
    'Riset ini mengeksplorasi gagasan Metacognitive Nexus sebagai kerangka konseptual untuk mempelajari proses pemantauan, evaluasi, dan pengaturan ulang langkah penalaran pada sistem AI.

Pembahasan tentang kesadaran buatan merupakan pertanyaan ilmiah dan filosofis yang kompleks. Karena itu, catatan ini memperlakukan ide sebagai hipotesis atau arah eksplorasi, bukan sebagai klaim bahwa kesadaran mesin telah berhasil diwujudkan.

Dokumentasi publik akan menekankan definisi yang jelas, asumsi, batasan, eksperimen yang dapat diperiksa, serta ruang untuk kritik dan perbaikan dari komunitas.',
    'journal', 'AI & Eksperimen', ARRAY['artificial intelligence','metacognition','research','open research'], FALSE, TRUE
  ),
  (
    'Dari gagasan ke produk: jurnal pengembangan LUMÓRA',
    'jurnal-pengembangan-produk-lumora',
    'Merekam pelajaran dari proses merancang produk aroma dan lifestyle, mulai dari konsep, prototipe, sampai penyajian produk.',
    'Pengembangan produk mengajarkan bahwa sebuah ide perlu diterjemahkan menjadi pengalaman yang benar-benar bisa digunakan. Prosesnya melibatkan pemilihan konsep, pengujian bahan, konsistensi hasil, penyajian visual, kemasan, dan evaluasi berdasarkan masukan pengguna.

LUMÓRA menjadi salah satu studi proses pengembangan produk lifestyle dan fragrance. Catatan publik akan berfokus pada pembelajaran, kualitas produk, desain, dan pengalaman pelanggan. Informasi biaya internal, pemasok privat, serta data operasional yang tidak ditujukan untuk publik tetap berada di luar dokumentasi ini.',
    'journal', 'Product Development', ARRAY['lumora','product development','lifestyle','fragrance'], FALSE, TRUE
  ),
  (
    'Diskusi: apa yang membuat proyek open-source mudah dipakai orang lain?',
    'diskusi-proyek-open-source-mudah-dipakai',
    'Mari bahas dokumentasi, struktur folder, lisensi, contoh penggunaan, dan cara menjaga proyek tetap ramah kontributor.',
    'Sebuah proyek mungkin berjalan dengan baik di komputer pembuatnya, tetapi apakah orang lain bisa memahami dan menjalankannya?

Menurutmu, apa tiga hal yang paling penting agar sebuah proyek open-source mudah digunakan orang lain? Apakah README yang jelas, contoh konfigurasi, lisensi, issue template, struktur folder, atau panduan kontribusi?

Bagikan pengalaman, praktik yang berhasil, atau kesalahan yang pernah kamu temui. Jaga diskusi tetap sopan dan sertakan konteks teknis bila memungkinkan.',
    'community', 'Open Source', ARRAY['open source','documentation','community discussion'], TRUE, TRUE
  ),
  (
    'Diskusi: proyek apa yang sedang kamu bangun dengan Arduino atau ESP32?',
    'diskusi-proyek-arduino-esp32-komunitas',
    'Tempat berbagi ide, prototipe, sensor, kendala rangkaian, dan pembelajaran seputar embedded systems.',
    'Sedang mencoba Arduino, ESP32, Raspberry Pi, sensor, atau perangkat IoT? Ceritakan proyek yang sedang kamu kerjakan.

Kamu bisa berbagi tujuan proyek, komponen yang digunakan, hal yang sudah berhasil, dan bagian yang masih menjadi tantangan. Untuk keselamatan, jangan membagikan rangkaian bertegangan berbahaya tanpa konteks dan prosedur yang tepat.

Diskusi terbuka untuk pemula maupun yang sudah berpengalaman. Fokus kita adalah saling membantu memahami prosesnya.',
    'community', 'Embedded, Robotics & IoT', ARRAY['arduino','esp32','iot','discussion'], FALSE, TRUE
  ),
  (
    'Diskusi: bagaimana kamu mengelola catatan belajar dan proyek?',
    'diskusi-metode-catatan-belajar-proyek',
    'Bagikan cara menyimpan dokumentasi, todo, hasil eksperimen, changelog, dan pelajaran dari pekerjaan sehari-hari.',
    'Proyek yang dikerjakan sedikit demi sedikit sering kali memiliki banyak keputusan kecil yang mudah terlupakan.

Bagaimana caramu menyimpan catatan? Apakah menggunakan Markdown, Git, Notion, spreadsheet, issue tracker, buku fisik, atau gabungan beberapa metode?

Ceritakan sistem yang paling membantumu tetap konsisten. Pengalaman sederhana dari proyek kecil juga sangat berguna bagi orang lain.',
    'community', 'Diskusi Teknologi', ARRAY['productivity','documentation','workflow','community'], FALSE, TRUE
  ),
  (
    'Utility kalkulator telur: memisahkan logika dari integrasi bot',
    'utility-kalkulator-telur-modular',
    'Catatan membuat fitur hitung sederhana sebagai modul mandiri agar bisa diuji dan dipakai ulang di lingkungan berbeda.',
    'Salah satu pelajaran dari mengembangkan bot adalah memisahkan logika inti dari platform yang memanggilnya. Fitur kalkulasi sebaiknya dapat menerima input, memvalidasi nilai, menghasilkan hasil yang konsisten, dan diuji tanpa harus menjalankan seluruh bot.

Pola ini membuat utility lebih mudah digunakan ulang pada server, command handler, maupun aplikasi lain. Dokumentasi input, output, batasan, dan contoh kasus menjadi bagian penting dari rilis.

Jurnal ini mencatat pendekatan modular yang dapat diterapkan pada fitur kalkulasi lain.',
    'journal', 'Aplikasi & Tools', ARRAY['javascript','utility','calculator','modular design'], FALSE, TRUE
  ),
  (
    'Mochi AI Mini Robot: dari konsep menuju prototipe',
    'mochi-ai-mini-robot-konsep-prototipe',
    'Catatan konsep robot mini interaktif dan tahapan belajar yang dibutuhkan sebelum membangun prototipe nyata.',
    'Mochi AI Mini Robot merupakan konsep produk robot mini interaktif yang menjadi arah eksplorasi teknologi. Tahap awalnya bukan langsung membuat robot kompleks, melainkan memetakan kebutuhan: bentuk fisik, input sensor, output suara atau cahaya, kendali, konektivitas, konsumsi daya, dan batas kemampuan perangkat.

Pembelajaran Arduino, ESP32, Raspberry Pi, dan dasar elektronika menjadi fondasi untuk menguji ide secara bertahap. Setiap prototipe perlu memiliki tujuan pengujian yang jelas agar kemajuan dapat dievaluasi.

Status catatan ini adalah konsep dan eksplorasi awal, bukan klaim bahwa produk final sudah tersedia.',
    'journal', 'Embedded, Robotics & IoT', ARRAY['robotics','ai robot','embedded systems','prototype'], FALSE, TRUE
  ),
  (
    'Catatan modifikasi aplikasi dan game secara bertanggung jawab',
    'modifikasi-aplikasi-game-bertanggung-jawab',
    'Prinsip publikasi mod, patch, konfigurasi, dan tutorial dengan tetap menghormati hak cipta serta lisensi pemilik konten.',
    'Eksperimen modifikasi dapat menjadi sarana belajar memahami struktur aplikasi, konfigurasi, antarmuka, dan perilaku software. Namun, tidak semua hasil modifikasi boleh dibagikan ulang dalam bentuk file lengkap.

Praktik yang lebih aman adalah membagikan patch, source mod, konfigurasi, dokumentasi, atau tutorial yang dibuat sendiri, lalu mengarahkan pengguna ke sumber resmi untuk file asli. Selalu periksa lisensi, ketentuan penggunaan, dan hak distribusi sebelum publikasi.

Kategori Game Modding di website ini ditujukan untuk karya yang memang boleh dibagikan, bukan untuk menyebarkan ulang binary game atau aset komersial tanpa izin.',
    'journal', 'Game Modding', ARRAY['game modding','software modification','copyright','patch'], FALSE, TRUE
  ),
  (
    'Diskusi: apa batas yang tepat saat membagikan hasil modifikasi game?',
    'diskusi-batas-publikasi-game-mod',
    'Ayo bertukar pandangan tentang patch, source mod, aset, lisensi, dan cara berbagi hasil eksperimen secara bertanggung jawab.',
    'Saat membuat mod, bagian mana yang menurutmu layak dibagikan secara publik? Apakah source mod, file konfigurasi, patch, tutorial, atau video demonstrasi?

Bagaimana cara memastikan mod tidak ikut menyertakan aset atau binary yang tidak boleh didistribusikan ulang? Bagikan praktik baik dan pengalamanmu, dengan tetap menghormati lisensi serta hak pemilik game.',
    'community', 'Diskusi Teknologi', ARRAY['game modding','patch','community','licensing'], FALSE, TRUE
  )
ON CONFLICT (slug) DO NOTHING;
