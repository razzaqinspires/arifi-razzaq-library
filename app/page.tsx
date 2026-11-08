import Link from "next/link";
import { LibraryBrowser } from "@/components/library-browser";

const quickLinks = [
  { number: "01", title: "Source code", detail: "Project files & repositories", icon: "{ }" },
  { number: "02", title: "Applications", detail: "Tools, utilities & builds", icon: "▦" },
  { number: "03", title: "Learning", detail: "Tutorials & walkthroughs", icon: "▶" },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="shell hero-content">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> OFFICIAL CREATOR LIBRARY</div>
            <p className="hero-overline">ARIFI RAZZAQ OFC <span> / </span> DIGITAL WORKS</p>
            <h1>Semua karya.<br /><span>Satu tempat.</span></h1>
            <p className="hero-description">Pusat koleksi project, source code, aplikasi, tools, dan materi dari konten Arifi Razzaq Official. Temukan detail rilis dan unduh file yang kamu butuhkan.</p>
            <div className="hero-actions">
              <a href="#library" className="button-primary">Jelajahi library <span>↓</span></a>
              <a href="https://www.youtube.com/@arifirazzaqofficial" target="_blank" rel="noreferrer" className="button-secondary">Kunjungi YouTube <span>↗</span></a>
            </div>
            <div className="hero-note"><span className="hero-note-mark">AR.</span><span><strong>Dibangun dan dikelola oleh Arifi Razzaq</strong><small>CREATOR · DEVELOPER · CONTENT MAKER</small></span></div>
          </div>
          <div className="hero-visual" aria-label="Pratinjau koleksi creator library">
            <div className="visual-backdrop" />
            <div className="library-preview">
              <div className="preview-top"><span className="preview-brand"><b>AR.</b> CREATOR LIBRARY</span><span className="preview-status"><i /> ONLINE</span></div>
              <div className="preview-heading"><span>YOUR DIGITAL SHELF</span><strong>Project<br />collection<span>.</span></strong></div>
              <div className="preview-list">
                {quickLinks.map((item) => <div className="preview-item" key={item.number}><span className="preview-icon">{item.icon}</span><span className="preview-text"><b>{item.title}</b><small>{item.detail}</small></span><span className="preview-number">{item.number}</span></div>)}
              </div>
              <div className="preview-bottom"><span>ORGANIZED RELEASES</span><span>EST. 2026</span></div>
            </div>
            <div className="preview-caption">KARYA DIGITAL, TERSUSUN RAPI.</div>
          </div>
        </div>
        <div className="hero-footer shell"><span>PROJECTS · RESOURCES · RELEASE NOTES</span><span>OFFICIAL RESOURCE HUB <b>•</b> INDONESIA</span></div>
      </section>

      <section className="value-strip shell" aria-label="Fitur library">
        <div><span className="value-icon">⌕</span><span><b>Mudah ditemukan</b><small>Pencarian dan kategori</small></span></div>
        <div><span className="value-icon">↧</span><span><b>Unduhan terpusat</b><small>File dan versi rilis</small></span></div>
        <div><span className="value-icon">◷</span><span><b>Informasi lengkap</b><small>Detail dan changelog</small></span></div>
        <div><span className="value-icon">♡</span><span><b>Masukan komunitas</b><small>Like, rating, komentar</small></span></div>
      </section>

      <div className="shell"><LibraryBrowser /></div>

      <section className="about-section" id="about">
        <div className="shell about-inner">
          <div className="about-heading"><span className="eyebrow">TENTANG LIBRARY</span><h2>Dibuat untuk<br /><span>berbagi karya.</span></h2></div>
          <div className="about-copy"><p>Website ini menjadi pusat informasi resmi untuk project dan materi yang dibagikan melalui channel Arifi Razzaq Official. Setiap konten dapat memiliki deskripsi, versi, changelog, video terkait, dan tautan unduhan.</p><p>Simpan halaman ini agar kamu bisa kembali menemukan rilis terbaru dengan mudah.</p><div className="about-actions"><a href="https://www.youtube.com/@arifirazzaqofficial" target="_blank" rel="noreferrer" className="text-button">Lihat channel YouTube ↗</a><Link href="/admin" className="text-button">Creator Studio ↗</Link></div></div>
        </div>
      </section>
    </main>
  );
}
