const WHATSAPP_URL =
  "https://wa.me/6283193905842?text=Halo%20Razzaq%20Ventures%2C%20saya%20ingin%20konsultasi%20pembuatan%20website.";

const projects = [
  {
    index: "01",
    name: "HERU BALI TOUR",
    type: "Website · Tour & Transport",
    status: "Published website",
    description:
      "Website katalog layanan tour dan transport dengan jalur pemesanan langsung melalui WhatsApp. Dibangun sebagai proyek website klien pertama yang dipublikasikan.",
    href: "https://heru-bali-tour-website.vercel.app/",
    action: "Buka website",
    featured: true,
  },
  {
    index: "02",
    name: "WHISKAY-BOT",
    type: "Software · WhatsApp Automation",
    status: "In development",
    description:
      "Bot WhatsApp modular berbasis Node.js dan Baileys, dengan sistem plugin, command discovery, serta pengelolaan fitur dan energi pengguna.",
    href: "https://github.com/razzaqinspires/whiskay-bot",
    action: "Lihat repositori",
    featured: false,
  },
  {
    index: "03",
    name: "AISYAH × NEXORA",
    type: "AI · Android Application",
    status: "In development",
    description:
      "Asisten AI dengan aplikasi Android, identitas pengguna, persistence memory, context engine, dan backend Node.js–PostgreSQL.",
    href: null,
    action: "Catatan proyek",
    featured: false,
  },
];

const templates = [
  {
    number: "T-01",
    title: "Tour & Travel",
    description:
      "Katalog armada, detail layanan, informasi perjalanan, dan pemesanan melalui WhatsApp.",
    state: "Live example",
    detail: "Contoh terpublikasi: HERU BALI TOUR",
    href: "https://heru-bali-tour-website.vercel.app/",
    action: "Lihat website live",
  },
  {
    number: "T-02",
    title: "Company Profile",
    description:
      "Profil perusahaan, layanan, portofolio, keunggulan, FAQ, dan formulir kontak.",
    state: "Starter concept",
    detail: "Struktur awal siap disesuaikan dengan identitas bisnis",
    href: "/website-templates/company-profile/index.html",
    action: "Buka template",
  },
  {
    number: "T-03",
    title: "Product & Brand Landing Page",
    description:
      "Landing page produk, katalog, cerita brand, galeri, dan tautan menuju marketplace.",
    state: "Starter concept",
    detail: "Struktur awal untuk brand dan UMKM",
    href: "/website-templates/product-landing/index.html",
    action: "Buka template",
  },
];

export function BusinessShowcase() {
  return (
    <>
      <section className="showcase-section" id="portfolio">
        <div className="shell">
          <div className="section-heading showcase-heading">
            <div>
              <span className="eyebrow">SELECTED DIGITAL WORKS</span>
              <h2>Portofolio & rekam jejak.</h2>
              <p>Proyek yang sudah dipublikasikan dan sistem yang masih dikembangkan.</p>
            </div>
            <span className="showcase-side-note">RAZZAQ VENTURES / DIGITAL WORKS</span>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article className={`project-card${project.featured ? " project-card-featured" : ""}`} key={project.index}>
                <div className="project-card-top">
                  <span className="project-index">PROJECT / {project.index}</span>
                  <span className={`project-status${project.featured ? " status-live" : ""}`}>
                    <i /> {project.status}
                  </span>
                </div>
                <div className={`project-art project-art-${project.index}`} aria-hidden="true">
                  <span className="project-art-mark">{project.name === "HERU BALI TOUR" ? "HBT" : project.name === "WHISKAY-BOT" ? "W/" : "NXR"}</span>
                  <span className="project-art-caption">{project.type}</span>
                </div>
                <div className="project-card-copy">
                  <span className="project-type">{project.type}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  {project.href ? (
                    <a href={project.href} target="_blank" rel="noopener noreferrer" className="project-link">
                      {project.action} <span>↗</span>
                    </a>
                  ) : (
                    <span className="project-internal-note">{project.action} · dokumentasi internal</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="template-section" id="templates">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OPEN WEBSITE TEMPLATES</span>
              <h2>Mulai dari struktur yang tepat.</h2>
              <p>Template terbuka untuk dipelajari dan dikembangkan sesuai kebutuhan bisnis.</p>
            </div>
          </div>
          <div className="template-grid">
            {templates.map((template) => (
              <article className="template-card" key={template.number}>
                <div className="template-card-top"><span>{template.number}</span><span>{template.state}</span></div>
                <div className="template-wireframe" aria-hidden="true">
                  <div className="wireframe-nav"><i /><i /><i /></div>
                  <div className="wireframe-hero"><b /><span /><span /></div>
                  <div className="wireframe-columns"><i /><i /><i /></div>
                </div>
                <h3>{template.title}</h3>
                <p>{template.description}</p>
                <small>{template.detail}</small>
                <a className="project-link template-open-link" href={template.href} target="_blank" rel="noopener noreferrer">{template.action} <span>↗</span></a>
              </article>
            ))}
          </div>
          <p className="template-disclaimer">Keterangan: hanya HERU BALI TOUR yang tercatat sebagai contoh website live pada halaman ini. Company Profile dan Product Landing Page masih berupa starter concept, bukan proyek klien yang telah selesai.</p>
        </div>
      </section>

      <section className="service-section" id="website-service">
        <div className="shell service-panel">
          <div className="service-copy">
            <span className="eyebrow">WEBSITE DEVELOPMENT CONSULTANCY</span>
            <h2>Bisnis Anda membutuhkan website yang jelas dan profesional.</h2>
            <p>Razzaq Ventures membantu perencanaan, desain, pengembangan, integrasi kontak, dan publikasi website untuk bisnis, layanan, maupun produk.</p>
            <div className="service-contact-line"><span>CONSULTATION VIA WHATSAPP</span><strong>+62 831-9390-5842</strong></div>
          </div>
          <div className="service-action">
            <span className="service-monogram">RV<span>.</span></span>
            <p>Konsultasikan kebutuhan website dan cakupan proyek Anda.</p>
            <a className="button-primary service-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Hubungi konsultan <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="infrastructure-section" id="infrastructure">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SYSTEMS & INFRASTRUCTURE</span>
              <h2>Di balik setiap produk digital.</h2>
              <p>Catatan teknologi yang mendukung pengembangan proyek Razzaq Ventures.</p>
            </div>
          </div>
          <div className="infrastructure-grid">
            <article className="infrastructure-card">
              <span className="infra-label">DATABASE / POSTGRESQL</span>
              <h3>Neon Database</h3>
              <p>Project database untuk penyimpanan data aplikasi. Konfigurasi layanan dan integrasi runtime masih menunggu proses CLI, autentikasi akun, deployment, serta pengujian koneksi.</p>
              <dl><div><dt>Project</dt><dd>bold-pond-23834459</dd></div><div><dt>Branch</dt><dd>production</dd></div></dl>
              <a href="https://console.neon.tech/app/projects/bold-pond-23834459/branches/br-fragrant-feather-azns5f5c" target="_blank" rel="noopener noreferrer" className="project-link">Buka Neon Console <span>↗</span></a>
            </article>
            <article className="infrastructure-card">
              <span className="infra-label">DEPLOYMENT / WEB HOSTING</span>
              <h3>Vercel</h3>
              <p>Platform deployment untuk website Next.js. HERU BALI TOUR telah memiliki alamat website publik.</p>
              <a href="https://heru-bali-tour-website.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-link">Lihat website live <span>↗</span></a>
            </article>
            <article className="infrastructure-card">
              <span className="infra-label">AUTOMATION / NODE.JS</span>
              <h3>WHISKAY-BOT</h3>
              <p>Infrastruktur otomasi WhatsApp berbasis plugin. Dokumentasi dan pengembangan modul dicatat sebagai bagian dari rekam kerja software.</p>
              <a href="https://github.com/razzaqinspires/whiskay-bot" target="_blank" rel="noopener noreferrer" className="project-link">Repositori proyek <span>↗</span></a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
