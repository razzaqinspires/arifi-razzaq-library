import { query } from "@/lib/db";
import { isAdmin } from "@/lib/http";
import { parsePostInput } from "@/lib/post-input";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return Response.json({ error: "ID post tidak valid." }, { status: 400 });
  try {
    const parsed = parsePostInput(await request.json());
    if (!parsed.data) return Response.json({ error: parsed.error }, { status: 400 });
    const p = parsed.data;
    const result = await query(
      `UPDATE posts SET title=$1, slug=$2, excerpt=$3, content=$4, kind=$5, category=$6,
       tags=$7, cover_image_url=$8, external_url=$9, featured=$10, published=$11, updated_at=NOW()
       WHERE id=$12 RETURNING id::int AS id, slug, published`,
      [p.title, p.slug, p.excerpt, p.content, p.kind, p.category, p.tags, p.coverImageUrl, p.externalUrl, p.featured, p.published, id],
    );
    if (!result.rowCount) return Response.json({ error: "Post tidak ditemukan." }, { status: 404 });
    return Response.json({ ok: true, post: result.rows[0] });
  } catch (error) {
    console.error("[PUT /api/admin/posts/:id]", error);
    const message = error instanceof Error && error.message.includes("duplicate key") ? "Slug post sudah digunakan oleh post lain." : "Post gagal diperbarui.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return Response.json({ error: "ID post tidak valid." }, { status: 400 });
  try {
    const result = await query("DELETE FROM posts WHERE id=$1 RETURNING id", [id]);
    if (!result.rowCount) return Response.json({ error: "Post tidak ditemukan." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/admin/posts/:id]", error);
    return Response.json({ error: "Post gagal dihapus." }, { status: 500 });
  }
}
