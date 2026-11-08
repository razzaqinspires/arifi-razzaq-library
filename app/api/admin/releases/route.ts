import { db } from "@/lib/db";
import { isAdmin, validHttpUrl } from "@/lib/http";
import type { ReleaseInput } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  try {
    const data = (await request.json()) as Partial<ReleaseInput>;
    const title = typeof data.title === "string" ? data.title.trim().slice(0, 180) : "";
    const slug = typeof data.slug === "string" ? data.slug.trim().toLowerCase().slice(0, 190) : "";
    const shortDescription = typeof data.shortDescription === "string" ? data.shortDescription.trim().slice(0, 280) : "";
    const description = typeof data.description === "string" ? data.description.trim().slice(0, 12000) : "";
    const category = typeof data.category === "string" ? data.category.trim().slice(0, 80) : "";
    const version = typeof data.version === "string" ? data.version.trim().slice(0, 60) : "";
    const downloadUrl = data.downloadUrl;
    if (!title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !shortDescription || !description || !category || !version || !validHttpUrl(downloadUrl)) {
      return Response.json({ error: "Periksa judul, slug, deskripsi, kategori, versi, dan URL download." }, { status: 400 });
    }
    const videoUrl = data.videoUrl?.trim() || null;
    const thumbnailUrl = data.thumbnailUrl?.trim() || null;
    if (videoUrl && !validHttpUrl(videoUrl)) return Response.json({ error: "URL video harus berupa http atau https." }, { status: 400 });
    if (thumbnailUrl && !validHttpUrl(thumbnailUrl)) return Response.json({ error: "URL thumbnail harus berupa http atau https." }, { status: 400 });
    const tags = Array.isArray(data.tags) ? data.tags.filter((v): v is string => typeof v === "string").map((v) => v.trim().slice(0, 32)).filter(Boolean).slice(0, 16) : [];
    const changelog = Array.isArray(data.changelog) ? data.changelog.filter((v): v is string => typeof v === "string").map((v) => v.trim().slice(0, 300)).filter(Boolean).slice(0, 40) : [];
    const result = await db.query(
      `INSERT INTO releases (title, slug, short_description, description, category, version,
       file_size, file_name, download_url, video_url, thumbnail_url, tags, changelog, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id::int AS id, slug`,
      [title, slug, shortDescription, description, category, version,
       data.fileSize?.trim().slice(0, 60) || null, data.fileName?.trim().slice(0, 180) || null,
       downloadUrl, videoUrl, thumbnailUrl, tags, changelog, Boolean(data.featured)],
    );
    return Response.json({ ok: true, release: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[admin create release]", error);
    const message = error instanceof Error && error.message.includes("duplicate key") ? "Slug sudah digunakan. Ubah slug konten." : "Konten gagal disimpan.";
    return Response.json({ error: message }, { status: 500 });
  }
}
