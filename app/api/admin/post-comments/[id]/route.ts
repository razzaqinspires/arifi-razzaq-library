import { query } from "@/lib/db";
import { isAdmin } from "@/lib/http";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return Response.json({ error: "ID komentar tidak valid." }, { status: 400 });
  try {
    const result = await query("DELETE FROM post_comments WHERE id=$1 RETURNING id", [id]);
    if (!result.rowCount) return Response.json({ error: "Komentar tidak ditemukan." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/admin/post-comments/:id]", error);
    return Response.json({ error: "Komentar gagal dihapus." }, { status: 500 });
  }
}
