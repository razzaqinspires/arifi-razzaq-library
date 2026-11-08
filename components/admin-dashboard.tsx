"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { ReleaseCard } from "@/lib/types";

type AdminComment = { id: number; name: string; body: string; status: string; createdAt: string; releaseTitle: string; releaseSlug: string };
type FormState = {
  title: string; slug: string; shortDescription: string; description: string; category: string; version: string;
  fileSize: string; fileName: string; downloadUrl: string; videoUrl: string; thumbnailUrl: string;
  tags: string; changelog: string; featured: boolean;
};
const emptyForm: FormState = { title: "", slug: "", shortDescription: "", description: "", category: "Coding", version: "1.0.0", fileSize: "", fileName: "", downloadUrl: "", videoUrl: "", thumbnailUrl: "", tags: "", changelog: "", featured: false };
const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"release" | "comments">("release");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [releases, setReleases] = useState<ReleaseCard[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refresh() {
    const [contentRes, commentsRes] = await Promise.all([fetch("/api/releases", { cache: "no-store" }), fetch("/api/admin/comments", { cache: "no-store" })]);
    if (contentRes.ok) setReleases((await contentRes.json()).releases ?? []);
    if (commentsRes.ok) setComments((await commentsRes.json()).comments ?? []);
  }

  useEffect(() => {
    fetch("/api/admin/session").then((response) => response.json()).then(async (data) => {
      setAuthenticated(Boolean(data.authenticated));
      if (data.authenticated) await refresh();
    }).catch(() => setLoginError("Tidak dapat memeriksa sesi admin.")).finally(() => setChecking(false));
  }, []);

  const totalDownloads = useMemo(() => releases.reduce((sum, release) => sum + Number(release.downloads || 0), 0), [releases]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json();
    if (!response.ok) { setLoginError(data.error || "Login gagal."); return; }
    setAuthenticated(true); setPassword(""); await refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false); setReleases([]); setComments([]);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function createRelease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setFormError(""); setNotice("");
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

  function cancelEdit() {
    setEditingId(null); setForm(emptyForm); setManualSlug(false); setFormError("");
  }

  async function deleteRelease(id: number, title: string) {
    if (!window.confirm(`Hapus rilis “${title}”? Komentar, likes, dan rating terkait juga akan dihapus.`)) return;
    const response = await fetch(`/api/admin/releases/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Gagal menghapus konten."); return; }
    setNotice("Rilis dihapus."); await refresh();
  }

  async function deleteComment(id: number) {
    if (!window.confirm("Hapus komentar ini?")) return;
    const response = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    if (!response.ok) { setNotice("Komentar gagal dihapus."); return; }
    await refresh();
  }

  if (checking) return <main className="shell admin-loading"><div className="skeleton-line" /><div className="skeleton-block" /></main>;
  if (!authenticated) return (
    <main className="admin-login-wrap">
      <div className="admin-login-card"><Link href="/" className="back-link">← Kembali ke website</Link><div className="admin-lock">AR<span>.</span></div><span className="eyebrow">AREA PENGELOLA</span><h1>Creator Studio<span className="accent-dot">.</span></h1><p>Masuk untuk mengelola rilis, tautan download, dan komentar di Arifi Razzaq Library.</p><form onSubmit={login}><label htmlFor="admin-password">PASSWORD ADMIN</label><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password admin" autoComplete="current-password" required /><button className="button-primary" type="submit">Masuk ke Creator Studio ↗</button>{loginError && <p className="form-error">{loginError}</p>}</form><small className="login-footnote">Akses ini hanya untuk pengelola website.</small></div>
    </main>
  );

  return (
    <main className="shell admin-page">
      <div className="admin-topline"><div><span className="eyebrow">ARIFI RAZZAQ / PENGELOLAAN</span><h1>Creator Studio<span className="accent-dot">.</span></h1><p>Kelola semua konten yang tampil di library publik.</p></div><div className="admin-top-actions"><Link href="/" className="button-secondary">Lihat website ↗</Link><button type="button" className="button-text" onClick={logout}>Keluar</button></div></div>
      <div className="admin-stat-grid"><div><small>KONTEN TERBIT</small><strong>{releases.length}</strong></div><div><small>TOTAL UNDUHAN</small><strong>{totalDownloads.toLocaleString("id-ID")}</strong></div><div><small>KOMENTAR</small><strong>{comments.length}</strong></div></div>
      <div className="admin-tabs"><button type="button" className={tab === "release" ? "active" : ""} onClick={() => setTab("release")}>Kelola konten</button><button type="button" className={tab === "comments" ? "active" : ""} onClick={() => setTab("comments")}>Komentar <span>{comments.length}</span></button></div>
      {notice && <div className="admin-notice">{notice}</div>}
      {tab === "release" ? <div className="admin-layout">
        <section className="admin-form-panel"><div className="panel-kicker">{editingId ? "EDIT PUBLISHED CONTENT" : "CREATE NEW ENTRY"}</div><h2>{editingId ? "Perbarui rilis" : "Terbitkan konten"}</h2><p className="muted-text">Isi detail project, informasi versi, video, dan tautan unduhan. Perubahan akan langsung tampil di library publik.</p>
          <form className="release-form" onSubmit={createRelease}>
            <label>Judul konten<input value={form.title} onChange={(event) => { const value = event.target.value; update("title", value); if (!manualSlug) update("slug", slugify(value)); }} placeholder="Contoh: WHISKAY BOT — Update Terbaru" required maxLength={180} /></label>
            <label>Slug / URL<input value={form.slug} onChange={(event) => { setManualSlug(true); update("slug", slugify(event.target.value)); }} placeholder="whiskay-bot-update-terbaru" required /><small>URL: /library/{form.slug || "slug-konten"}</small></label>
            <label>Deskripsi singkat<input value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} placeholder="Ringkasan singkat untuk kartu konten" required maxLength={280} /></label>
            <label>Deskripsi lengkap<textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={5} placeholder="Jelaskan fungsi, fitur, kebutuhan, dan catatan penggunaan..." required /></label>
            <div className="form-two-col"><label>Kategori<select value={form.category} onChange={(event) => update("category", event.target.value)}>{["Coding", "Bot & Automation", "Android & Apps", "Tutorial", "Tools", "Project Update", "Other"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Versi<input value={form.version} onChange={(event) => update("version", event.target.value)} placeholder="1.0.0" required /></label></div>
            <div className="form-two-col"><label>Ukuran file<input value={form.fileSize} onChange={(event) => update("fileSize", event.target.value)} placeholder="42 MB" /></label><label>Nama file<input value={form.fileName} onChange={(event) => update("fileName", event.target.value)} placeholder="project-v1.0.0.zip" /></label></div>
            <label>URL download langsung<input type="url" value={form.downloadUrl} onChange={(event) => update("downloadUrl", event.target.value)} placeholder="https://github.com/.../releases/download/..." required /></label>
            <label>URL video YouTube<input type="url" value={form.videoUrl} onChange={(event) => update("videoUrl", event.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></label>
            <label>URL thumbnail / cover<input type="url" value={form.thumbnailUrl} onChange={(event) => update("thumbnailUrl", event.target.value)} placeholder="https://.../thumbnail.jpg" /></label>
            <label>Tags <span className="label-hint">Pisahkan dengan koma</span><input value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="nodejs, whatsapp bot, update" /></label>
            <label>Changelog <span className="label-hint">Satu perubahan per baris</span><textarea value={form.changelog} onChange={(event) => update("changelog", event.target.value)} rows={4} placeholder={"Perbaikan bug utama\nPenambahan fitur baru\nDokumentasi diperbarui"} /></label>
            <label className="featured-toggle"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> <span>Tandai sebagai featured release</span></label>
            {formError && <p className="form-error">{formError}</p>}<div className="form-actions"><button className="button-primary publish-button" disabled={saving} type="submit">{saving ? "Menyimpan..." : editingId ? "Simpan perubahan ↗" : "Terbitkan konten ↗"}</button>{editingId && <button className="button-secondary" type="button" onClick={cancelEdit}>Batal edit</button>}</div>
          </form>
        </section>
        <section className="admin-list-panel"><div className="panel-kicker">LIBRARY KAMU</div><h2>Konten terbit <span>{releases.length}</span></h2>{releases.length ? <div className="managed-list">{releases.map((release) => <article className="managed-item" key={release.id}><div className="managed-avatar">AR</div><div className="managed-info"><strong>{release.title}</strong><small>{release.category} · v{release.version} · {release.downloads} downloads</small><Link href={`/library/${release.slug}`} target="_blank">Buka detail ↗</Link></div><div className="managed-actions"><button type="button" className="edit-button" onClick={() => editRelease(release)}>Edit</button><button type="button" className="delete-button" onClick={() => deleteRelease(release.id, release.title)} aria-label={`Hapus ${release.title}`}>Hapus</button></div></article>)}</div> : <div className="small-empty">Belum ada rilis yang dipublikasikan.</div>}</section>
      </div> : <section className="admin-comments-panel"><div className="panel-kicker">MODERASI KOMENTAR</div><h2>Komentar terbaru</h2>{comments.length ? comments.map((comment) => <article key={comment.id} className="moderation-item"><div><strong>{comment.name}</strong><small>Pada <Link href={`/library/${comment.releaseSlug}`} target="_blank">{comment.releaseTitle}</Link> · {new Date(comment.createdAt).toLocaleString("id-ID")}</small><p>{comment.body}</p></div><button type="button" className="delete-button" onClick={() => deleteComment(comment.id)}>Hapus</button></article>) : <p className="muted-text">Belum ada komentar masuk.</p>}</section>}
      <p className="admin-safety-note">Keamanan: jangan membagikan password admin. Pastikan file yang dipublikasikan berasal dari sumber tepercaya.</p>
    </main>
  );
}
