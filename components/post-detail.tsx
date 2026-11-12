"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { POST_KIND_LABELS } from "@/lib/content";
import type { CommentItem, PostDetail } from "@/lib/types";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Tanggal tidak tersedia" : new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(date);
}

export function PostDetailView({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/posts/${slug}`, { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Post tidak ditemukan.");
      if (active) setPost(data.post);
    }).catch((err) => { if (active) setError(err instanceof Error ? err.message : "Post gagal dimuat."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setNotice("");
    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Komentar gagal dikirim.");
      setPost((current) => current ? { ...current, comments: [data.comment, ...current.comments], commentsCount: current.commentsCount + 1 } : current);
      setName("");
      setBody("");
      setNotice("Komentar berhasil dikirim.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Komentar gagal dikirim.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <main className="shell detail-loading"><div className="skeleton-line" /><div className="skeleton-block" /></main>;
  if (error || !post) return <main className="shell state-panel error-panel detail-error"><strong>Post tidak tersedia</strong><p>{error || "Post ini mungkin telah dihapus atau belum dipublikasikan."}</p><Link href="/#worklog" className="text-button">← Kembali ke rekam kerja</Link></main>;

  return (
    <main className="shell post-detail-page">
      <div className="breadcrumbs"><Link href="/">Beranda</Link><span>/</span><Link href="/#worklog">Rekam kerja</Link><span>/</span><strong>{post.title}</strong></div>
      <article className="post-article">
        <header className="post-article-header">
          <div className="release-meta"><span>{POST_KIND_LABELS[post.kind]}</span><span>{post.category}</span><span>{formatDate(post.createdAt)}</span></div>
          <h1>{post.title}</h1>
          <p className="post-article-excerpt">{post.excerpt}</p>
          {post.coverImageUrl && <div className="post-article-cover" style={{ backgroundImage: `url("${post.coverImageUrl}")` }} role="img" aria-label={`Cover ${post.title}`} />}
        </header>
        <div className="post-article-content">{post.content}</div>
        {post.tags.length > 0 && <div className="tag-list post-tags">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
        {post.externalUrl && <a href={post.externalUrl} target="_blank" rel="noreferrer" className="button-secondary post-reference-link">Lihat referensi terkait ↗</a>}
      </article>

      <section className="post-discussion" id="discussion">
        <div className="post-discussion-heading"><div className="panel-kicker">COMMUNITY DISCUSSION</div><h2>Ruang diskusi <span>{post.comments.length}</span></h2><p>Tambahkan pengalaman, pertanyaan, atau masukan yang relevan dengan post ini.</p></div>
        <form className="comment-form post-comment-form" onSubmit={submitComment}>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama kamu" minLength={2} maxLength={48} required />
          <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Tulis komentar atau tanggapan..." minLength={3} maxLength={1200} rows={4} required />
          <button className="button-primary comment-submit" type="submit" disabled={sending}>{sending ? "Mengirim..." : "Kirim komentar ↗"}</button>
        </form>
        {notice && <p className="form-notice">{notice}</p>}
        <div className="comment-list">{post.comments.length ? post.comments.map((comment: CommentItem) => <article className="comment-item" key={comment.id}><div className="comment-avatar">{comment.name.slice(0, 1).toUpperCase()}</div><div><div className="comment-heading"><strong>{comment.name}</strong><time>{formatDate(comment.createdAt)}</time></div><p>{comment.body}</p></div></article>) : <p className="muted-text no-comments">Belum ada komentar. Jadilah orang pertama yang memulai diskusi.</p>}</div>
      </section>
      <div className="back-to-library"><Link href="/#worklog">← Kembali ke jurnal dan komunitas</Link></div>
    </main>
  );
}
