import { db } from "@/lib/db";
import { isAdmin, validHttpUrl } from "@/lib/http";
import type { ReleaseInput } from "@/lib/types";

type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";

export async function PUT(request: Request, context: Context) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return Response.json({ error: "ID tidak valid." }, { status: 400 });

  try {
    const data = (await request.json()) as Partial<ReleaseInput>;
    const title = typeof data.title === "string" ? data.title.trim().slice(0, 180) : "";
    const slug = typeof data.slug === "string" ? data.slug.trim().toLowerCase().slice(0, 190) : "";
    const shortDescription = typeof data.shortDescription === "string" ? data.shortDescription.trim().slice(0, 280) : "";
    const description = typeof data.description === "string" ? data.description.trim().slice(0, 12000) : "";
    const category = typeof data.category === "string" ? data.category.trim().slice(0, 80) : "";
    const version = typeof data.version === "string" ? data.version.trim().slice(0, 60) : "";
    if (!title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !shortDescription || !description || !category || !version || !validHttpUrl(data.downloadUrl)) {
      return Response.json({ error: "Periksa judul, slug, deskripsi, kategori, versi, dan URL download." }, { status: 400 });
    }
    const videoUrl = typeof data.videoUrl === "string" && data.videoUrl.trim() ? data.videoUrl.trim() : null;
    const thumbnailUrl = typeof data.thumbnailUrl === "string" && data.thumbnailUrl.trim() ? data.thumbnailUrl.trim() : null;
    if (videoUrl && !validHttpUrl(videoUrl)) return Response.json({ error: "URL video harus berupa http atau https." }, { status: 400 });
    if (thumbnailUrl && !validHttpUrl(thumbnailUrl)) return Response.json({ error: "URL thumbnail harus berupa http atau https." }, { status: 400 });
    const tags = Array.isArray(data.tags) ? data.tags.filter((v): v is string => typeof v === "string").map((v) => v.trim().slice(0, 32)).filter(Boolean).slice(0, 16) : [];
    const changelog = Array.isArray(data.changelog) ? data.changelog.filter((v): v is string => typeof v === "string").map((v) => v.trim().slice(0, 300)).filter(Boolean).slice(0, 40) : [];

    const result = await db.query(
      `UPDATE releases SET title = $1, slug = $2, short_description = $3, description = $4,
       category = $5, version = $6, file_size = $7, file_name = $8, download_url = $9,
       video_url = $10, thumbnail_url = $11, tags = $12, changelog = $13,
       featured = $14, updated_at = NOW()
       WHERE id = $15 RETURNING id::int AS id, slug`,
      [title, slug, shortDescription, description, category, version,
        typeof data.fileSize === "string" ? data.fileSize.trim().slice(0, 60) || null : null,
        typeof data.fileName === "string" ? data.fileName.trim().slice(0, 180) || null : null,
        data.downloadUrl, videoUrl, thumbnailUrl, tags, changelog, Boolean(data.featured), id],
    );
    if (!result.rowCount) return Response.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    return Response.json({ ok: true, release: result.rows[0] });
  } catch (error) {
    console.error("[admin update release]", error);
    const message = error instanceof Error && error.message.includes("duplicate key") ? "Slug sudah digunakan oleh konten lain." : "Konten gagal diperbarui.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return Response.json({ error: "ID tidak valid." }, { status: 400 });
  try {
    const result = await db.query("DELETE FROM releases WHERE id = $1 RETURNING id", [id]);
    if (!result.rowCount) return Response.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[admin delete release]", error);
    return Response.json({ error: "Konten gagal dihapus." }, { status: 500 });
  }
}
