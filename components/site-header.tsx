import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Link href="/" className="brand" aria-label="Arifi Razzaq Official beranda">
          <span className="brand-mark">AR<span>.</span></span>
          <span className="brand-copy"><strong>ARIFI RAZZAQ</strong><small>OFFICIAL LIBRARY</small></span>
        </Link>
        <nav className="main-nav" aria-label="Navigasi utama">
          <Link href="/#library">Library</Link>
          <Link href="/#about">Tentang</Link>
          <a href="https://www.youtube.com/@arifirazzaqofficial" target="_blank" rel="noreferrer">YouTube <span className="external-mark">↗</span></a>
        </nav>
        <Link className="nav-admin" href="/admin">Creator Studio <span>↗</span></Link>
      </div>
    </header>
  );
}
