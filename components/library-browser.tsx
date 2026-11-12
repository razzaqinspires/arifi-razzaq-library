"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReleaseCard } from "@/lib/types";
import { LIBRARY_CATEGORIES } from "@/lib/content";

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Tanggal tidak tersedia" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function LibraryBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState("newest");
  const [releases, setReleases] = useState<ReleaseCard[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (category !== "Semua") params.set("category", category);
        params.set("sort", sort);
        const response = await fetch(`/api/releases?${params.toString()}`, { signal: controller.signal, cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Library gagal dimuat.");
        setReleases(data.releases ?? []);
        setCategories(data.categories ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 240 : 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, category, sort]);

  const reset = () => { setQuery(""); setCategory("Semua"); setSort("newest"); };
  const visibleCategories = Array.from(new Set([...LIBRARY_CATEGORIES, ...categories]));

  return (
    <section className="library-section" id="library">
      <div className="section-heading">
        <div><span className="eyebrow">BROWSE COLLECTION</span><h2>Jelajahi library<span className="accent-dot">.</span></h2><p>Source code, script, aplikasi, tools, dan file rilis yang siap dibagikan.</p></div>
        <div className="library-count"><strong>{loading ? "—" : releases.length.toString().padStart(2, "0")}</strong><span>KONTEN DITEMUKAN</span></div>
      </div>
      <div className="library-controls">
        <label className="search-box"><span className="search-icon">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari project, versi, atau kata kunci..." aria-label="Cari library" /></label>
        <label className="sort-control"><span>Urutkan</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Urutkan konten"><option value="newest">Terbaru</option><option value="downloads">Paling banyak diunduh</option><option value="rating">Rating tertinggi</option><option value="likes">Paling disukai</option></select></label>
      </div>
      <div className="category-row" aria-label="Filter kategori">
        {["Semua", ...visibleCategories].map((item) => <button key={item} onClick={() => setCategory(item)} className={`category-chip ${category === item ? "active" : ""}`} type="button" aria-pressed={category === item}>{item === "Semua" ? <span className="chip-icon">◫</span> : null}{item}</button>)}
      </div>
      <div className="library-result-line"><span>{loading ? "Memuat koleksi..." : `${releases.length} konten tersedia`}</span><span>ARIFI RAZZAQ · LIBRARY</span></div>
      {error ? <div className="state-panel error-panel"><strong>Library belum tersedia</strong><p>{error}</p><span>Periksa koneksi database dan konfigurasi server.</span></div> : loading ? (
        <div className="release-grid">{[1, 2, 3].map((n) => <div className="release-skeleton" key={n}><div /><i /><i /></div>)}</div>
      ) : releases.length === 0 ? (
        <div className="empty-library"><span className="empty-symbol">AR<span>.</span></span><h3>{query || category !== "Semua" ? "Belum ada hasil yang cocok." : "Library sedang disiapkan."}</h3><p>{query || category !== "Semua" ? "Coba kata kunci atau kategori lain." : "Konten baru akan ditampilkan di sini setelah dipublikasikan melalui Creator Studio."}</p>{query || category !== "Semua" ? <button type="button" className="text-button" onClick={reset}>Hapus filter ↗</button> : <Link href="/admin" className="text-button">Buka Creator Studio ↗</Link>}</div>
      ) : (
        <div className="release-grid">
          {releases.map((release, index) => (
            <Link href={`/library/${release.slug}`} className="release-card" key={release.id}>
              <div className={`release-cover ${release.thumbnailUrl ? "has-thumbnail" : ""}`} style={release.thumbnailUrl ? { backgroundImage: `linear-gradient(180deg, rgba(26,35,30,.02), rgba(26,35,30,.12)), url("${release.thumbnailUrl}")` } : undefined}>
                {!release.thumbnailUrl && <><div className="cover-shape cover-shape-one" /><div className="cover-shape cover-shape-two" /><span className="cover-monogram">AR<span>.</span></span><span className="cover-index">COLLECTION / {String(index + 1).padStart(2, "0")}</span></>}
                {release.featured && <span className="featured-label">PILIHAN CREATOR</span>}
                <span className="cover-category">{release.category}</span>
              </div>
              <div className="release-card-body">
                <div className="release-meta"><span>V{release.version}</span><span>{dateLabel(release.createdAt)}</span></div>
                <h3>{release.title}</h3><p>{release.shortDescription}</p>
                <div className="card-foot"><span className="file-size">{release.fileSize || "Digital release"}</span><span className="card-stats"><span>↓ {release.downloads.toLocaleString("id-ID")}</span><span>♡ {release.likes}</span><span>★ {release.rating ?? "—"}</span></span><span className="card-arrow">↗</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
