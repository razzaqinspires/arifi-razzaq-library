"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { CommentItem, ReleaseDetail } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(value));
}

function youtubeEmbed(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    let id = "";
    if (url.hostname.includes("youtu.be")) id = url.pathname.slice(1);
    if (url.hostname.includes("youtube.com")) id = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop() || "";
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch { return null; }
}

export function ReleaseDetail({ slug }: { slug: string }) {
  const [release, setRelease] = useState<ReleaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/releases/${slug}`, { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Konten tidak ditemukan.");
      if (active) {
        setRelease(data.release);
        setLiked(Boolean(data.release.viewerLiked));
        setScore(Number(data.release.viewerRating || 0));
      }
    }).catch((err) => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  async function toggleLike() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/releases/${slug}/like`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Like gagal.");
      setLiked(data.liked);
      setRelease((current) => current ? { ...current, likes: data.likes } : current);
    } catch (err) { setNotice(err instanceof Error ? err.message : "Like gagal."); }
    finally { setBusy(false); }
  }

  async function rate(value: number) {
    setScore(value);
    try {
      const response = await fetch(`/api/releases/${slug}/rating`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ score: value }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Rating gagal.");
      setRelease((current) => current ? { ...current, rating: data.rating, ratingCount: data.ratingCount } : current);
      setNotice("Rating tersimpan.");
    } catch (err) { setNotice(err instanceof Error ? err.message : "Rating gagal."); }
  }

  async function sendComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (commentBusy) return;
    setCommentBusy(true);
    setNotice("");
    try {
      const response = await fetch(`/api/releases/${slug}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, body }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Komentar gagal dikirim.");
      setRelease((current) => current ? { ...current, comments: [data.comment, ...current.comments] } : current);
      setName(""); setBody(""); setNotice("Komentar berhasil dikirim.");
    } catch (err) { setNotice(err instanceof Error ? err.message : "Komentar gagal dikirim."); }
    finally { setCommentBusy(false); }
  }

  if (loading) return <main className="shell detail-loading"><div className="skeleton-line" /><div className="skeleton-block" /></main>;
  if (error || !release) return <main className="shell state-panel error-panel detail-error"><strong>Konten tidak tersedia</strong><p>{error || "Konten ini mungkin telah dihapus."}</p><Link href="/#library" className="text-button">← Kembali ke library</Link></main>;

  const embed = youtubeEmbed(release.videoUrl);
  return (
    <main className="shell detail-page">
      <div className="breadcrumbs"><Link href="/">Beranda</Link><span>/</span><Link href="/#library">Library</Link><span>/</span><strong>{release.title}</strong></div>
      <section className="detail-hero">
        <div className="detail-art" style={release.thumbnailUrl ? { backgroundImage: `linear-gradient(180deg, rgba(7,10,14,.12), rgba(7,10,14,.75)), url("${release.thumbnailUrl}")` } : undefined}>
          {!release.thumbnailUrl && <><div className="cover-grid" /><span className="detail-monogram">AR<span>.</span></span><small>CREATOR LIBRARY / RELEASE</small></>}
          {release.featured && <span className="featured-label">PILIHAN CREATOR</span>}
        </div>
        <div className="detail-intro">
          <div className="release-meta detail-meta"><span>{release.category.toUpperCase()}</span><span>VERSI {release.version}</span><span>{formatDate(release.createdAt)}</span></div>
          <h1>{release.title}<span className="accent-dot">.</span></h1>
          <p className="detail-subtitle">{release.shortDescription}</p>
          <div className="detail-metrics"><span><strong>{release.downloads.toLocaleString("id-ID")}</strong> UNDUHAN</span><span><strong>{release.likes}</strong> SUKA</span><span><strong>{release.rating ?? "—"}</strong> RATING</span></div>
          <div className="detail-actions"><a href={`/api/download/${release.slug}`} className="button-primary">Unduh sekarang <span>↓</span></a><button type="button" className={`button-secondary ${liked ? "is-liked" : ""}`} onClick={toggleLike} disabled={busy}>{liked ? "♥ Disukai" : "♡ Suka"} <span>{release.likes}</span></button>{release.videoUrl && <a className="button-text" href={release.videoUrl} target="_blank" rel="noreferrer">Tonton video ↗</a>}</div>
          <p className="detail-note">Baca detail dan catatan versi sebelum mengunduh file.</p>
        </div>
      </section>

      <div className="detail-columns">
        <div className="detail-main-column">
          <section className="content-panel"><div className="panel-kicker">01 / INFORMASI</div><h2>Informasi konten</h2><p className="long-description">{release.description}</p>
            <div className="spec-grid"><div><small>VERSION</small><strong>{release.version}</strong></div><div><small>CATEGORY</small><strong>{release.category}</strong></div><div><small>FILE SIZE</small><strong>{release.fileSize || "Tidak dicantumkan"}</strong></div><div><small>FILE NAME</small><strong>{release.fileName || "Lihat sumber unduhan"}</strong></div></div>
            {release.tags.length > 0 && <div className="tag-list">{release.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
          </section>
          <section className="content-panel changelog-panel"><div className="panel-kicker">02 / PEMBARUAN</div><h2>Catatan versi</h2>{release.changelog.length ? <ul className="changelog-list">{release.changelog.map((item, index) => <li key={`${index}-${item}`}><span>+</span>{item}</li>)}</ul> : <p className="muted-text">Belum ada catatan perubahan untuk versi ini.</p>}</section>
          {embed && <section className="content-panel video-panel"><div className="panel-kicker">03 / VIDEO TERKAIT</div><h2>Lihat video panduan</h2><div className="video-frame"><iframe src={embed} title={`Video ${release.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></section>}
        </div>
        <aside className="detail-side-column">
          <section className="content-panel rating-panel"><div className="panel-kicker">ULASAN KOMUNITAS</div><h2>Beri penilaian</h2><div className="rating-big"><strong>{release.rating ?? "—"}</strong><span> / 5</span></div><div className="star-picker" aria-label="Pilih rating">{[1,2,3,4,5].map((value) => <button key={value} type="button" aria-label={`Beri ${value} bintang`} className={value <= score ? "selected" : ""} onClick={() => rate(value)}>★</button>)}</div><p className="muted-text">{release.ratingCount} penilaian · Rating dapat diperbarui.</p></section>
          <section className="content-panel comments-panel"><div className="panel-kicker">KOMUNITAS / DISKUSI</div><h2>Komentar <span className="comment-count">{release.comments.length}</span></h2><form onSubmit={sendComment} className="comment-form"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama kamu" minLength={2} maxLength={48} required /><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Tulis komentar atau pertanyaan..." minLength={3} maxLength={1200} rows={4} required /><button className="button-primary comment-submit" type="submit" disabled={commentBusy}>{commentBusy ? "Mengirim..." : "Kirim komentar ↗"}</button></form>{notice && <p className="form-notice">{notice}</p>}<div className="comment-list">{release.comments.length ? release.comments.map((comment: CommentItem) => <article className="comment-item" key={comment.id}><div className="comment-avatar">{comment.name.slice(0,1).toUpperCase()}</div><div><div className="comment-heading"><strong>{comment.name}</strong><time>{formatDate(comment.createdAt)}</time></div><p>{comment.body}</p></div></article>) : <p className="muted-text no-comments">Belum ada komentar. Mulai diskusi tentang rilis ini.</p>}</div></section>
        </aside>
      </div>
      <div className="back-to-library"><Link href="/#library">← Kembali ke semua konten</Link></div>
    </main>
  );
}
