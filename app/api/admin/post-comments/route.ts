import { query } from "@/lib/db";
import { isAdmin } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  try {
    const result = await query(
      `SELECT c.id::int AS id, c.name, c.body, c.status, c.created_at AS "createdAt",
              p.title AS "postTitle", p.slug AS "postSlug"
       FROM post_comments c JOIN posts p ON p.id = c.post_id
       ORDER BY c.created_at DESC LIMIT 200`,
    );
    return Response.json({ comments: result.rows });
  } catch (error) {
    console.error("[GET /api/admin/post-comments]", error);
    return Response.json({ error: "Komentar post gagal dimuat." }, { status: 503 });
  }
}
