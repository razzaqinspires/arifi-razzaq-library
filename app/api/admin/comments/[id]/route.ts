import { db } from "@/lib/db";
import { isAdmin } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return Response.json({ error: "ID tidak valid." }, { status: 400 });
  try {
    await db.query("DELETE FROM release_comments WHERE id = $1", [id]);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[admin delete comment]", error);
    return Response.json({ error: "Komentar gagal dihapus." }, { status: 500 });
  }
}
