# HERU BALI TOUR — Tour & Transport Bali

Website draft untuk Heru Bali Tour, dibuat oleh Razzaq Ventures. Identitas visual, copywriting, layout, dan implementasi dibuat khusus untuk draft ini dan tidak menyalin website referensi.

## Fitur

- Landing page responsif untuk desktop dan ponsel.
- Katalog kendaraan dengan filter kategori.
- Modal formulir booking yang menyusun pesan WhatsApp.
- Tombol chat WhatsApp langsung.
- Bagian layanan, profil, FAQ, dan navigasi.
- HTML/CSS/JavaScript tanpa framework atau proses build.

## Kontak yang dikonfigurasi

- Nama bisnis: HERU BALI TOUR
- WhatsApp: 0823 2258 9437
- Format tautan WhatsApp: `https://wa.me/6282322589437`

Nomor di atas dimasukkan berdasarkan informasi yang diberikan klien.

## Menjalankan secara lokal

Bisa dibuka langsung dengan `index.html`, atau jalankan server lokal dari folder ini:

```bash
npx serve .
```

## Data yang masih harus dikonfirmasi sebelum publikasi

1. Logo resmi dan panduan merek Heru Bali Tour.
2. Daftar kendaraan aktual, foto unit, kapasitas, transmisi, dan harga. Enam kendaraan di katalog saat ini adalah contoh tampilan, bukan inventaris terverifikasi.
3. Jenis layanan yang benar-benar tersedia, ketentuan sewa, area layanan, serta jam operasional.
4. Profil perusahaan, pengalaman, dan informasi legal/kontak tambahan.
5. Kebijakan privasi dan ketentuan pemesanan jika formulir digunakan secara publik.

Foto kendaraan saat ini menggunakan gambar ilustrasi eksternal dari Unsplash. Ganti dengan foto milik klien yang sudah mendapat izin penggunaan.

## Deploy ke Vercel

Impor folder/repository ini ke Vercel sebagai proyek static. Tidak memerlukan build command. Set output directory ke `.` bila diminta.

## Batasan versi ini

Belum ada backend, database, autentikasi admin, kalender ketersediaan, pembayaran, maupun penyimpanan reservasi. Formulir hanya mengarahkan detail permintaan ke WhatsApp.
