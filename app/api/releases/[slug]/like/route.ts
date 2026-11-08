import { db } from "@/lib/db";
import { getVisitorId } from "@/lib/visitor";

export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, context: Context) {
  const { slug } = await context.params;
  try {
    const release = await db.query("SELECT id FROM releases WHERE slug = $1", [slug]);
    if (!release.rowCount) return Response.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    const visitorId = await getVisitorId();
    const inserted = await db.query(
      `INSERT INTO release_likes (release_id, visitor_id) VALUES ($1, $2)
       ON CONFLICT (release_id, visitor_id) DO NOTHING RETURNING id`,
      [release.rows[0].id, visitorId],
    );
    let liked = inserted.rowCount === 1;
    if (!liked) {
      await db.query("DELETE FROM release_likes WHERE release_id = $1 AND visitor_id = $2", [release.rows[0].id, visitorId]);
      liked = false;
    }
    const count = await db.query("SELECT COUNT(*)::int AS count FROM release_likes WHERE release_id = $1", [release.rows[0].id]);
    return Response.json({ liked, likes: count.rows[0].count });
  } catch (error) {
    console.error("[POST like]", error);
    return Response.json({ error: "Like gagal diproses." }, { status: 503 });
  }
}
