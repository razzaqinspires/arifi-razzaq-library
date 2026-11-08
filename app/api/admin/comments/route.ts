import { query } from "@/lib/db";
import { isAdmin } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  try {
    const result = await query(
      `SELECT c.id::int AS id, c.name, c.body, c.status, c.created_at AS "createdAt",
              r.title AS "releaseTitle", r.slug AS "releaseSlug"
       FROM release_comments c JOIN releases r ON r.id = c.release_id
       ORDER BY c.created_at DESC LIMIT 200`,
    );
    return Response.json({ comments: result.rows });
  } catch (error) {
    console.error("[admin comments]", error);
    return Response.json({ error: "Komentar gagal dimuat." }, { status: 503 });
  }
}
