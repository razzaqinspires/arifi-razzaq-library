import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-main"><div><span className="footer-brand"><b>AR.</b> ARIFI RAZZAQ</span><p>Public worklog, digital library, dan ruang berbagi pengetahuan.</p></div><div className="footer-links"><Link href="/#library">Library</Link><Link href="/#worklog">Rekam Kerja</Link><Link href="/#community">Komunitas</Link><Link href="/#portfolio">Portofolio</Link><Link href="/#templates">Template</Link><Link href="/#infrastructure">Infrastruktur</Link><Link href="/#website-service">Jasa Website</Link><Link href="/admin">Creator Studio</Link><a href="https://www.youtube.com/@arifirazzaqofficial" target="_blank" rel="noreferrer">YouTube ↗</a></div><div className="footer-consultant"><span>KONSULTASI PEMBUATAN WEBSITE</span><a href="https://wa.me/6283193905842?text=Halo%20Razzaq%20Ventures%2C%20saya%20ingin%20konsultasi%20pembuatan%20website." target="_blank" rel="noopener noreferrer">WhatsApp +62 831-9390-5842 ↗</a></div></div>
        <div className="footer-bottom"><small>© {new Date().getFullYear()} Arifi Razzaq. Public work & learning archive.</small><small>OPEN KNOWLEDGE · INDONESIA</small></div>
      </div>
    </footer>
  );
}
