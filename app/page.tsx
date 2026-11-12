import Link from "next/link";
import { LibraryBrowser } from "@/components/library-browser";
import { PostBrowser } from "@/components/post-browser";

const quickLinks = [
  { number: "01", title: "Public Library", detail: "Source code, scripts & tools", icon: "{ }" },
  { number: "02", title: "Work Journal", detail: "Development logs & learning", icon: "◷" },
  { number: "03", title: "Community", detail: "Posts, questions & discussion", icon: "↗" },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="shell hero-content">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> PUBLIC WORKLOG & OPEN LIBRARY</div>
            <p className="hero-overline">ARIFI RAZZAQ <span> / </span> DIGITAL WORKS & NOTES</p>
            <h1>Proses nyata.<br /><span>Karya terbuka.</span></h1>
            <p className="hero-description">Ruang publik untuk merekam apa yang sedang dikerjakan: coding, bot, aplikasi, eksperimen teknologi, proses belajar, hingga karya yang siap dibagikan. Temukan file, baca jurnal, atau ikut berdiskusi.</p>
            <div className="hero-actions">
              <a href="#library" className="button-primary">Jelajahi karya <span>↓</span></a>
              <a href="#worklog" className="button-secondary">Lihat rekam kerja <span>↗</span></a>
            </div>
            <div className="hero-note"><span className="hero-note-mark">AR.</span><span><strong>Dokumentasi kerja dan pembelajaran terbuka</strong><small>CREATOR · DEVELOPER · LIFELONG LEARNER</small></span></div>
          </div>
          <div className="hero-visual" aria-label="Pratinjau library publik, jurnal kerja, dan komunitas">
            <div className="visual-backdrop" />
            <div className="library-preview">
              <div className="preview-top"><span className="preview-brand"><b>AR.</b> CREATOR LIBRARY</span><span className="preview-status"><i /> ONLINE</span></div>
              <div className="preview-heading"><span>WORKS · NOTES · SHARING</span><strong>Open work<br />archive<span>.</span></strong></div>
              <div className="preview-list">
                {quickLinks.map((item) => <div className="preview-item" key={item.number}><span className="preview-icon">{item.icon}</span><span className="preview-text"><b>{item.title}</b><small>{item.detail}</small></span><span className="preview-number">{item.number}</span></div>)}
              </div>
              <div className="preview-bottom"><span>PROJECTS · FIELD NOTES</span><span>EST. 2026</span></div>
            </div>
            <div className="preview-caption">KARYA DIGITAL, TERSUSUN RAPI.</div>
          </div>
        </div>
        <div className="hero-footer shell"><span>PROJECTS · WORKLOG · OPEN KNOWLEDGE</span><span>PUBLIC CREATOR SPACE <b>•</b> INDONESIA</span></div>
      </section>

      <section className="value-strip shell" aria-label="Fitur library">
        <div><span className="value-icon">⌕</span><span><b>Terstruktur</b><small>Kategori, tag, dan pencarian</small></span></div>
        <div><span className="value-icon">{"{ }"}</span><span><b>Berbagi karya</b><small>Source, script, dan tools</small></span></div>
        <div><span className="value-icon">◷</span><span><b>Jejak proses</b><small>Jurnal kerja dan eksperimen</small></span></div>
        <div><span className="value-icon">↗</span><span><b>Ruang diskusi</b><small>Post dan komentar komunitas</small></span></div>
      </section>

      <div className="shell"><LibraryBrowser /><PostBrowser /></div>

      <section className="about-section" id="about">
        <div className="shell about-inner">
          <div className="about-heading"><span className="eyebrow">TENTANG RUANG PUBLIK INI</span><h2>Merekam proses.<br /><span>Membagikan ilmu.</span></h2></div>
          <div className="about-copy"><p>Website ini menggabungkan tiga hal: library untuk file dan rilis yang bisa digunakan, jurnal kerja untuk mencatat proses pengembangan dan pembelajaran, serta ruang komunitas untuk berdiskusi melalui post.</p><p>Topiknya dapat berkembang mengikuti apa pun yang sedang dikerjakan—software, bot, AI, embedded systems, modifikasi, produk, konten, maupun eksperimen baru. Arsip ini berorientasi pada pengetahuan terbuka, dengan tetap menjaga informasi pribadi dan internal agar tidak ikut terpublikasi.</p><div className="about-actions"><a href="https://www.youtube.com/@arifirazzaqofficial" target="_blank" rel="noreferrer" className="text-button">Lihat channel YouTube ↗</a><Link href="/admin" className="text-button">Creator Studio ↗</Link></div></div>
        </div>
      </section>
    </main>
  );
}
