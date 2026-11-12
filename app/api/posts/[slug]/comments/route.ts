import { query } from "@/lib/db";
import { getVisitorId } from "@/lib/visitor";

export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: Context) {
  const { slug } = await context.params;
  try {
    const input = await request.json();
    const name = typeof input.name === "string" ? input.name.trim().slice(0, 48) : "";
    const body = typeof input.body === "string" ? input.body.trim().slice(0, 1200) : "";
    if (name.length < 2 || body.length < 3) return Response.json({ error: "Nama dan komentar harus diisi (minimal 2 dan 3 karakter)." }, { status: 400 });
    const post = await query("SELECT id FROM posts WHERE slug = $1 AND published = TRUE", [slug]);
    if (!post.rowCount) return Response.json({ error: "Post tidak ditemukan." }, { status: 404 });
    const visitorId = await getVisitorId();
    const result = await query(
      `INSERT INTO post_comments (post_id, visitor_id, name, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id::int AS id, name, body, created_at AS "createdAt"`,
      [post.rows[0].id, visitorId, name, body],
    );
    return Response.json({ comment: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/posts/:slug/comments]", error);
    return Response.json({ error: "Komentar gagal dikirim." }, { status: 503 });
  }
}
