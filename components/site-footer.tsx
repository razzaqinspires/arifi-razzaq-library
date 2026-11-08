import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-main"><div><span className="footer-brand"><b>AR.</b> ARIFI RAZZAQ OFC</span><p>Tempat resmi untuk menemukan project, resource, dan pembaruan karya digital.</p></div><div className="footer-links"><Link href="/#library">Library</Link><Link href="/#about">Tentang</Link><Link href="/admin">Creator Studio</Link><a href="https://www.youtube.com/@arifirazzaqofficial" target="_blank" rel="noreferrer">YouTube ↗</a></div></div>
        <div className="footer-bottom"><small>© {new Date().getFullYear()} Arifi Razzaq. All rights reserved.</small><small>MADE WITH CARE · INDONESIA</small></div>
      </div>
    </footer>
  );
}
