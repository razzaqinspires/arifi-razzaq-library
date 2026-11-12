import Link from "next/link";
export default function NotFound() { return <main className="shell not-found"><span className="eyebrow">ERROR / 404</span><h1>Page not found<span className="accent-dot">.</span></h1><p>Halaman yang kamu cari tidak tersedia.</p><Link className="button-primary" href="/">Kembali ke beranda ↗</Link></main>; }
