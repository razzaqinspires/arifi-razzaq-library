"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { POST_CATEGORIES, POST_KIND_LABELS } from "@/lib/content";
import type { PostCard, PostKind } from "@/lib/types";

const kindFilters: Array<{ value: "all" | PostKind; label: string }> = [
  { value: "all", label: "Semua post" },
  { value: "journal", label: "Jurnal kerja" },
  { value: "community", label: "Komunitas" },
  { value: "announcement", label: "Pengumuman" },
];

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Tanggal tidak tersedia" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function PostBrowser() {
  const [kind, setKind] = useState<"all" | PostKind>("all");
  const [category, setCategory] = useState("Semua");
  const [queryText, setQueryText] = useState("");
  const [posts, setPosts] = useState<PostCard[]>([]);
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
        if (kind !== "all") params.set("kind", kind);
        if (category !== "Semua") params.set("category", category);
        if (queryText.trim()) params.set("q", queryText.trim());
        const response = await fetch(`/api/posts?${params.toString()}`, { signal: controller.signal, cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Post gagal dimuat.");
        setPosts(data.posts ?? []);
        setCategories(data.categories ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, queryText ? 220 : 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [kind, category, queryText]);

  function resetFilters() {
    setKind("all");
    setCategory("Semua");
    setQueryText("");
  }

  const visibleCategories = categories.length ? categories : [...POST_CATEGORIES];

  return (
    <section className="posts-section" id="worklog">
      <div className="section-heading posts-heading">
        <div>
          <span className="eyebrow">WORKLOG · NOTES · COMMUNITY</span>
          <h2>Rekam kerja & komunitas<span className="accent-dot">.</span></h2>
          <p>Jejak proses, pembelajaran, eksperimen, dan diskusi terbuka. Bukan hanya hasil akhir.</p>
        </div>
        <div className="library-count"><strong>{loading ? "—" : posts.length.toString().padStart(2, "0")}</strong><span>POST PUBLIK</span></div>
      </div>

      <div className="post-tools">
        <label className="search-box post-search"><span className="search-icon">⌕</span><input value={queryText} onChange={(event) => setQueryText(event.target.value)} placeholder="Cari jurnal, eksperimen, atau topik diskusi..." aria-label="Cari post" /></label>
        <div className="post-kind-row" id="community" aria-label="Filter jenis post">
          {kindFilters.map((item) => <button key={item.value} type="button" className={`category-chip ${kind === item.value ? "active" : ""}`} onClick={() => { setKind(item.value); setCategory("Semua"); }} aria-pressed={kind === item.value}>{item.label}</button>)}
        </div>
      </div>

      <div className="post-category-row" aria-label="Filter kategori post">
        {["Semua", ...visibleCategories].map((item) => <button key={item} type="button" className={`category-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
      </div>
      <div className="library-result-line"><span>{loading ? "Memuat post..." : `${posts.length} post ditemukan`}</span><span>PUBLIC NOTES · OPEN DISCUSSION</span></div>

      {error ? <div className="state-panel error-panel"><strong>Post belum tersedia</strong><p>{error}</p><span>Periksa koneksi database dan konfigurasi server.</span></div> : loading ? (
        <div className="post-grid">{[1, 2, 3].map((value) => <div className="release-skeleton" key={value}><div /><i /><i /></div>)}</div>
      ) : posts.length === 0 ? (
        <div className="empty-library post-empty"><span className="empty-symbol">AR<span>.</span></span><h3>Belum ada post yang cocok.</h3><p>Coba kata kunci, jenis post, atau kategori lain.</p><button type="button" className="text-button" onClick={resetFilters}>Hapus filter ↗</button></div>
      ) : (
        <div className="post-grid">
          {posts.map((post, index) => (
            <Link href={`/posts/${post.slug}`} className="post-card" key={post.id}>
              <div className={`post-card-art ${post.coverImageUrl ? "has-post-cover" : ""}`} style={post.coverImageUrl ? { backgroundImage: `linear-gradient(180deg, rgba(25,35,28,.05), rgba(25,35,28,.56)), url("${post.coverImageUrl}")` } : undefined}>
                {!post.coverImageUrl && <><span className="post-art-index">FIELD NOTE / {String(index + 1).padStart(2, "0")}</span><span className="post-art-symbol">{post.kind === "community" ? "↗" : post.kind === "announcement" ? "✳" : "{ }"}</span></>}
                {post.featured && <span className="featured-label">PILIHAN</span>}
                <span className="post-type-label">{POST_KIND_LABELS[post.kind]}</span>
              </div>
              <div className="post-card-body">
                <div className="release-meta"><span>{post.category}</span><span>{dateLabel(post.createdAt)}</span></div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="post-card-foot"><span>{post.commentsCount} komentar</span><span>Baca post ↗</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="public-note"><span>PUBLIC BY DESIGN</span><p>Yang dibagikan adalah karya dan pengetahuan yang layak dipublikasikan. Data pribadi, kredensial, dan informasi internal tetap dijaga.</p></div>
    </section>
  );
}
