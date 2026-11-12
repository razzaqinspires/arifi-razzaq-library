"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { LIBRARY_CATEGORIES, POST_CATEGORIES, POST_KIND_LABELS } from "@/lib/content";
import type { PostCard, PostKind, ReleaseCard } from "@/lib/types";

type AdminComment = {
  id: number;
  name: string;
  body: string;
  status: string;
  createdAt: string;
  title: string;
  slug: string;
  kind: "release" | "post";
};

type FormState = {
  title: string; slug: string; shortDescription: string; description: string; category: string; version: string;
  fileSize: string; fileName: string; downloadUrl: string; videoUrl: string; thumbnailUrl: string;
  tags: string; changelog: string; featured: boolean;
};
type PostFormState = {
  title: string; slug: string; excerpt: string; content: string; kind: PostKind; category: string;
  tags: string; coverImageUrl: string; externalUrl: string; featured: boolean; published: boolean;
};
type AdminPost = PostCard & { content: string };

const emptyForm: FormState = {
  title: "", slug: "", shortDescription: "", description: "", category: "Software & Coding", version: "1.0.0",
  fileSize: "", fileName: "", downloadUrl: "", videoUrl: "", thumbnailUrl: "", tags: "", changelog: "", featured: false,
};
const emptyPostForm: PostFormState = {
  title: "", slug: "", excerpt: "", content: "", kind: "journal", category: "Catatan Harian",
  tags: "", coverImageUrl: "", externalUrl: "", featured: false, published: true,
};
const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"release" | "posts" | "comments">("release");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [postForm, setPostForm] = useState<PostFormState>(emptyPostForm);
  const [releases, setReleases] = useState<ReleaseCard[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [saving, setSaving] = useState(false);
  const [postSaving, setPostSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [postError, setPostError] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [manualPostSlug, setManualPostSlug] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  async function refresh() {
    const [contentRes, postsRes, commentsRes, postCommentsRes] = await Promise.all([
      fetch("/api/releases", { cache: "no-store" }),
      fetch("/api/admin/posts", { cache: "no-store" }),
      fetch("/api/admin/comments", { cache: "no-store" }),
      fetch("/api/admin/post-comments", { cache: "no-store" }),
    ]);
    if (contentRes.ok) setReleases((await contentRes.json()).releases ?? []);
    if (postsRes.ok) setPosts((await postsRes.json()).posts ?? []);
    const merged: AdminComment[] = [];
    if (commentsRes.ok) {
      const data = await commentsRes.json();
      merged.push(...(data.comments ?? []).map((item: Record<string, unknown>) => ({
        id: Number(item.id), name: String(item.name), body: String(item.body), status: String(item.status),
        createdAt: String(item.createdAt), title: String(item.releaseTitle), slug: String(item.releaseSlug), kind: "release" as const,
      })));
    }
    if (postCommentsRes.ok) {
      const data = await postCommentsRes.json();
      merged.push(...(data.comments ?? []).map((item: Record<string, unknown>) => ({
        id: Number(item.id), name: String(item.name), body: String(item.body), status: String(item.status),
        createdAt: String(item.createdAt), title: String(item.postTitle), slug: String(item.postSlug), kind: "post" as const,
      })));
    }
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setComments(merged);
  }

  useEffect(() => {
    fetch("/api/admin/session").then((response) => response.json()).then(async (data) => {
      setAuthenticated(Boolean(data.authenticated));
      if (data.authenticated) await refresh();
    }).catch(() => setLoginError("Tidak dapat memeriksa sesi admin.")).finally(() => setChecking(false));
  }, []);

  const totalDownloads = useMemo(() => releases.reduce((sum, release) => sum + Number(release.downloads || 0), 0), [releases]);
  const releaseCategoryOptions = Array.from(new Set([form.category, ...LIBRARY_CATEGORIES, "Coding", "Android & Apps", "Tutorial", "Tools", "Project Update", "Other"]));
  const postCategoryOptions = Array.from(new Set([postForm.category, ...POST_CATEGORIES]));

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json();
    if (!response.ok) { setLoginError(data.error || "Login gagal."); return; }
    setAuthenticated(true);
    setPassword("");
    await refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setReleases([]);
    setPosts([]);
    setComments([]);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function updatePost<K extends keyof PostFormState>(key: K, value: PostFormState[K]) {
    setPostForm((current) => ({ ...current, [key]: value }));
  }

  async function saveRelease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setFormError(""); setNotice("");
    const payload = {
      ...form,
      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      changelog: form.changelog.split("\n").map((item) => item.trim()).filter(Boolean),
    };
    try {
      const endpoint = editingId ? `/api/admin/releases/${editingId}` : "/api/admin/releases";
      const response = await fetch(endpoint, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) { setFormError(data.error || "Konten gagal disimpan."); return; }
      setForm(emptyForm); setManualSlug(false); setNotice(editingId ? "Perubahan rilis berhasil disimpan." : `Rilis berhasil dibuat: ${data.release.slug}`); setEditingId(null); await refresh();
    } catch {
      setFormError("Tidak dapat terhubung ke server. Periksa koneksi lalu coba kembali.");
    } finally {
      setSaving(false);
    }
  }

  async function editRelease(release: ReleaseCard) {
    setFormError(""); setNotice("");
    try {
      const response = await fetch(`/api/releases/${release.slug}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Detail konten gagal dimuat.");
      const item = data.release;
      setForm({
        title: item.title, slug: item.slug, shortDescription: item.shortDescription, description: item.description,
        category: item.category, version: item.version, fileSize: item.fileSize || "", fileName: item.fileName || "",
        downloadUrl: item.downloadUrl, videoUrl: item.videoUrl || "", thumbnailUrl: item.thumbnailUrl || "",
        tags: (item.tags || []).join(", "), changelog: (item.changelog || []).join("\n"), featured: Boolean(item.featured),
      });
      setManualSlug(true); setEditingId(release.id); setTab("release");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Detail konten gagal dimuat.");
    }
  }

  function cancelReleaseEdit() {
    setEditingId(null); setForm(emptyForm); setManualSlug(false); setFormError("");
  }

  async function deleteRelease(id: number, title: string) {
    if (!window.confirm(`Hapus rilis “${title}”? Komentar, likes, dan rating terkait juga akan dihapus.`)) return;
    const response = await fetch(`/api/admin/releases/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Gagal menghapus konten."); return; }
    setNotice("Rilis dihapus."); await refresh();
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPostSaving(true); setPostError(""); setNotice("");
    const payload = { ...postForm, tags: postForm.tags.split(",").map((item) => item.trim()).filter(Boolean) };
    try {
      const endpoint = editingPostId ? `/api/admin/posts/${editingPostId}` : "/api/admin/posts";
      const response = await fetch(endpoint, { method: editingPostId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) { setPostError(data.error || "Post gagal disimpan."); return; }
      setPostForm(emptyPostForm); setManualPostSlug(false); setEditingPostId(null);
      setNotice(editingPostId ? "Post berhasil diperbarui." : `Post berhasil dibuat: ${data.post.slug}`);
      await refresh();
    } catch {
      setPostError("Tidak dapat terhubung ke server. Periksa koneksi lalu coba kembali.");
    } finally {
      setPostSaving(false);
    }
  }

  function editPost(post: AdminPost) {
    setPostForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, kind: post.kind,
      category: post.category, tags: (post.tags || []).join(", "), coverImageUrl: post.coverImageUrl || "",
      externalUrl: post.externalUrl || "", featured: Boolean(post.featured), published: Boolean(post.published),
    });
    setManualPostSlug(true); setEditingPostId(post.id); setPostError(""); setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelPostEdit() {
    setEditingPostId(null); setPostForm(emptyPostForm); setManualPostSlug(false); setPostError("");
  }

  async function deletePost(id: number, title: string) {
    if (!window.confirm(`Hapus post “${title}”? Semua komentar pada post ini juga akan dihapus.`)) return;
    const response = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Post gagal dihapus."); return; }
    setNotice("Post dihapus."); await refresh();
  }

  async function deleteComment(comment: AdminComment) {
    if (!window.confirm("Hapus komentar ini?")) return;
    const endpoint = comment.kind === "post" ? `/api/admin/post-comments/${comment.id}` : `/api/admin/comments/${comment.id}`;
    const response = await fetch(endpoint, { method: "DELETE" });
    if (!response.ok) { setNotice("Komentar gagal dihapus."); return; }
    setNotice("Komentar dihapus.");
    await refresh();
  }

  if (checking) return <main className="shell admin-loading"><div className="skeleton-line" /><div className="skeleton-block" /></main>;
  if (!authenticated) return (
    <main className="admin-login-wrap">
      <div className="admin-login-card">
        <Link href="/" className="back-link">← Kembali ke website</Link>
        <div className="admin-lock">AR<span>.</span></div>
        <span className="eyebrow">AREA PENGELOLA</span>
        <h1>Creator Studio<span className="accent-dot">.</span></h1>
        <p>Masuk untuk mengelola rilis library, jurnal kerja, post komunitas, dan komentar publik.</p>
        <form onSubmit={login}>
          <label htmlFor="admin-password">PASSWORD ADMIN</label>
          <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password admin" autoComplete="current-password" required />
          <button className="button-primary" type="submit">Masuk ke Creator Studio ↗</button>
          {loginError && <p className="form-error">{loginError}</p>}
        </form>
        <small className="login-footnote">Akses ini hanya untuk pengelola website.</small>
      </div>
    </main>
  );

  return (
    <main className="shell admin-page">
      <div className="admin-topline"><div><span className="eyebrow">ARIFI RAZZAQ / PENGELOLAAN</span><h1>Creator Studio<span className="accent-dot">.</span></h1><p>Kelola library, rekam kerja, dan ruang komunitas publik.</p></div><div className="admin-top-actions"><Link href="/" className="button-secondary">Lihat website ↗</Link><button type="button" className="button-text" onClick={logout}>Keluar</button></div></div>
      <div className="admin-stat-grid admin-stat-grid-four">
        <div><small>RILIS LIBRARY</small><strong>{releases.length}</strong></div>
        <div><small>JURNAL & POST</small><strong>{posts.length}</strong></div>
        <div><small>TOTAL UNDUHAN</small><strong>{totalDownloads.toLocaleString("id-ID")}</strong></div>
        <div><small>KOMENTAR</small><strong>{comments.length}</strong></div>
      </div>
      <div className="admin-tabs">
        <button type="button" className={tab === "release" ? "active" : ""} onClick={() => setTab("release")}>Library & file</button>
        <button type="button" className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>Jurnal & post <span>{posts.length}</span></button>
        <button type="button" className={tab === "comments" ? "active" : ""} onClick={() => setTab("comments")}>Komentar <span>{comments.length}</span></button>
      </div>
      {notice && <div className="admin-notice">{notice}</div>}

      {tab === "release" ? <div className="admin-layout">
        <section className="admin-form-panel">
          <div className="panel-kicker">{editingId ? "EDIT PUBLISHED CONTENT" : "CREATE NEW LIBRARY ENTRY"}</div>
          <h2>{editingId ? "Perbarui rilis" : "Terbitkan file & project"}</h2>
          <p className="muted-text">Gunakan bagian ini untuk source code, script, aplikasi, tools, modifikasi buatan sendiri, dan materi unduhan. Jurnal proses ditulis di tab Jurnal & post.</p>
          <form className="release-form" onSubmit={saveRelease}>
            <label>Judul konten<input value={form.title} onChange={(event) => { const value = event.target.value; update("title", value); if (!manualSlug) update("slug", slugify(value)); }} placeholder="Contoh: WhatsApp Bot — Modular Update" required maxLength={180} /></label>
            <label>Slug / URL<input value={form.slug} onChange={(event) => { setManualSlug(true); update("slug", slugify(event.target.value)); }} placeholder="whatsapp-bot-modular-update" required /><small>URL: /library/{form.slug || "slug-konten"}</small></label>
            <label>Deskripsi singkat<input value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} placeholder="Ringkasan untuk kartu library" required maxLength={280} /></label>
            <label>Deskripsi lengkap<textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={5} placeholder="Jelaskan fungsi, fitur, kebutuhan, lisensi, dan catatan penggunaan..." required /></label>
            <div className="form-two-col"><label>Kategori<select value={form.category} onChange={(event) => update("category", event.target.value)}>{releaseCategoryOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Versi<input value={form.version} onChange={(event) => update("version", event.target.value)} placeholder="1.0.0" required /></label></div>
            <div className="form-two-col"><label>Ukuran file<input value={form.fileSize} onChange={(event) => update("fileSize", event.target.value)} placeholder="42 MB" /></label><label>Nama file<input value={form.fileName} onChange={(event) => update("fileName", event.target.value)} placeholder="project-v1.0.0.zip" /></label></div>
            <label>URL download langsung<input type="url" value={form.downloadUrl} onChange={(event) => update("downloadUrl", event.target.value)} placeholder="https://github.com/.../releases/download/..." required /></label>
            <label>URL video YouTube<input type="url" value={form.videoUrl} onChange={(event) => update("videoUrl", event.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></label>
            <label>URL thumbnail / cover<input type="url" value={form.thumbnailUrl} onChange={(event) => update("thumbnailUrl", event.target.value)} placeholder="https://.../thumbnail.jpg" /></label>
            <label>Tags <span className="label-hint">Pisahkan dengan koma</span><input value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="nodejs, whatsapp bot, update" /></label>
            <label>Changelog <span className="label-hint">Satu perubahan per baris</span><textarea value={form.changelog} onChange={(event) => update("changelog", event.target.value)} rows={4} placeholder={"Perbaikan bug utama\nPenambahan fitur baru\nDokumentasi diperbarui"} /></label>
            <label className="featured-toggle"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> <span>Tandai sebagai featured release</span></label>
            {formError && <p className="form-error">{formError}</p>}
            <div className="form-actions"><button className="button-primary publish-button" disabled={saving} type="submit">{saving ? "Menyimpan..." : editingId ? "Simpan perubahan ↗" : "Terbitkan ke library ↗"}</button>{editingId && <button className="button-secondary" type="button" onClick={cancelReleaseEdit}>Batal edit</button>}</div>
          </form>
        </section>
        <section className="admin-list-panel"><div className="panel-kicker">DOWNLOADABLE LIBRARY</div><h2>Rilis terbit <span>{releases.length}</span></h2>{releases.length ? <div className="managed-list">{releases.map((release) => <article className="managed-item" key={release.id}><div className="managed-avatar">AR</div><div className="managed-info"><strong>{release.title}</strong><small>{release.category} · v{release.version} · {release.downloads} downloads</small><Link href={`/library/${release.slug}`} target="_blank">Buka detail ↗</Link></div><div className="managed-actions"><button type="button" className="edit-button" onClick={() => editRelease(release)}>Edit</button><button type="button" className="delete-button" onClick={() => deleteRelease(release.id, release.title)} aria-label={`Hapus ${release.title}`}>Hapus</button></div></article>)}</div> : <div className="small-empty">Belum ada file atau project yang dipublikasikan.</div>}</section>
      </div> : null}

      {tab === "posts" ? <div className="admin-layout">
        <section className="admin-form-panel">
          <div className="panel-kicker">{editingPostId ? "EDIT POST" : "WRITE A PUBLIC POST"}</div>
          <h2>{editingPostId ? "Perbarui post" : "Tulis jurnal atau diskusi"}</h2>
          <p className="muted-text">Jurnal untuk mencatat proses kerja. Komunitas untuk pertanyaan dan diskusi. Hindari memasukkan data pribadi, modal internal, password, token, atau konfigurasi privat.</p>
          <form className="release-form" onSubmit={savePost}>
            <label>Jenis post<select value={postForm.kind} onChange={(event) => updatePost("kind", event.target.value as PostKind)}><option value="journal">Jurnal Kerja</option><option value="community">Ruang Komunitas / Diskusi</option><option value="announcement">Pengumuman</option></select></label>
            <label>Judul post<input value={postForm.title} onChange={(event) => { const value = event.target.value; updatePost("title", value); if (!manualPostSlug) updatePost("slug", slugify(value)); }} placeholder="Contoh: Catatan pengembangan bot modular" required maxLength={180} /></label>
            <label>Slug / URL<input value={postForm.slug} onChange={(event) => { setManualPostSlug(true); updatePost("slug", slugify(event.target.value)); }} placeholder="catatan-pengembangan-bot" required /><small>URL: /posts/{postForm.slug || "slug-post"}</small></label>
            <label>Ringkasan<input value={postForm.excerpt} onChange={(event) => updatePost("excerpt", event.target.value)} placeholder="Ringkasan singkat yang terlihat pada kartu post" required maxLength={360} /></label>
            <label>Isi post<textarea value={postForm.content} onChange={(event) => updatePost("content", event.target.value)} rows={12} placeholder="Tulis proses kerja, hal yang dipelajari, konteks teknis, pertanyaan, atau diskusi. Pisahkan paragraf dengan baris kosong." required /></label>
            <label>Kategori<select value={postForm.category} onChange={(event) => updatePost("category", event.target.value)}>{postCategoryOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Tags <span className="label-hint">Pisahkan dengan koma</span><input value={postForm.tags} onChange={(event) => updatePost("tags", event.target.value)} placeholder="nodejs, learning, open-source" /></label>
            <label>URL cover (opsional)<input type="url" value={postForm.coverImageUrl} onChange={(event) => updatePost("coverImageUrl", event.target.value)} placeholder="https://.../cover.jpg" /></label>
            <label>URL referensi / repositori (opsional)<input type="url" value={postForm.externalUrl} onChange={(event) => updatePost("externalUrl", event.target.value)} placeholder="https://github.com/..." /></label>
            <div className="post-toggles"><label className="featured-toggle"><input type="checkbox" checked={postForm.featured} onChange={(event) => updatePost("featured", event.target.checked)} /> <span>Prioritaskan post ini</span></label><label className="featured-toggle"><input type="checkbox" checked={postForm.published} onChange={(event) => updatePost("published", event.target.checked)} /> <span>Publikasikan sekarang</span></label></div>
            {postError && <p className="form-error">{postError}</p>}
            <div className="form-actions"><button className="button-primary publish-button" disabled={postSaving} type="submit">{postSaving ? "Menyimpan..." : editingPostId ? "Simpan post ↗" : "Terbitkan post ↗"}</button>{editingPostId && <button className="button-secondary" type="button" onClick={cancelPostEdit}>Batal edit</button>}</div>
          </form>
        </section>
        <section className="admin-list-panel"><div className="panel-kicker">WORKLOG & COMMUNITY</div><h2>Post tersimpan <span>{posts.length}</span></h2>{posts.length ? <div className="managed-list">{posts.map((post) => <article className="managed-item" key={post.id}><div className="managed-avatar">{post.kind === "community" ? "↗" : "JR"}</div><div className="managed-info"><strong>{post.title}</strong><small>{POST_KIND_LABELS[post.kind]} · {post.category} · {post.published ? "Publik" : "Draft"}</small>{post.published && <Link href={`/posts/${post.slug}`} target="_blank">Buka post ↗</Link>}</div><div className="managed-actions"><button type="button" className="edit-button" onClick={() => editPost(post)}>Edit</button><button type="button" className="delete-button" onClick={() => deletePost(post.id, post.title)} aria-label={`Hapus ${post.title}`}>Hapus</button></div></article>)}</div> : <div className="small-empty">Belum ada jurnal atau post komunitas.</div>}</section>
      </div> : null}

      {tab === "comments" ? <section className="admin-comments-panel"><div className="panel-kicker">COMMUNITY MODERATION</div><h2>Komentar terbaru</h2>{comments.length ? comments.map((comment) => <article key={`${comment.kind}-${comment.id}`} className="moderation-item"><div><strong>{comment.name}</strong><small>Pada <Link href={comment.kind === "post" ? `/posts/${comment.slug}` : `/library/${comment.slug}`} target="_blank">{comment.title}</Link> · {comment.kind === "post" ? "Post" : "Library"} · {new Date(comment.createdAt).toLocaleString("id-ID")}</small><p>{comment.body}</p></div><button type="button" className="delete-button" onClick={() => deleteComment(comment)}>Hapus</button></article>) : <p className="muted-text">Belum ada komentar masuk.</p>}</section> : null}

      <p className="admin-safety-note">Publikasi aman: gunakan source code milik sendiri atau yang lisensinya mengizinkan, jangan unggah aset berhak cipta tanpa izin, dan jangan pernah memasukkan token, password, data pribadi, atau rahasia bisnis.</p>
    </main>
  );
}
