import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Link href="/" className="brand" aria-label="Arifi Razzaq beranda">
          <span className="brand-mark">AR<span>.</span></span>
          <span className="brand-copy"><strong>ARIFI RAZZAQ</strong><small>WORKLOG & PUBLIC LIBRARY</small></span>
        </Link>
        <nav className="main-nav" aria-label="Navigasi utama">
          <Link href="/#library">Library</Link>
          <Link href="/#worklog">Rekam Kerja</Link>
          <Link href="/#community">Komunitas</Link>
        </nav>
        <Link className="nav-admin" href="/admin">Studio <span>↗</span></Link>
      </div>
    </header>
  );
}
