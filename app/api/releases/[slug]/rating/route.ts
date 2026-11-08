import { db } from "@/lib/db";
import { getVisitorId } from "@/lib/visitor";

export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: Context) {
  const { slug } = await context.params;
  try {
    const body = await request.json();
    const score = Number(body.score);
    if (!Number.isInteger(score) || score < 1 || score > 5) return Response.json({ error: "Rating harus 1 sampai 5." }, { status: 400 });
    const release = await db.query("SELECT id FROM releases WHERE slug = $1", [slug]);
    if (!release.rowCount) return Response.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    const visitorId = await getVisitorId();
    await db.query(
      `INSERT INTO release_ratings (release_id, visitor_id, score) VALUES ($1, $2, $3)
       ON CONFLICT (release_id, visitor_id) DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()`,
      [release.rows[0].id, visitorId, score],
    );
    const aggregate = await db.query("SELECT ROUND(AVG(score)::numeric, 1)::float AS rating, COUNT(*)::int AS count FROM release_ratings WHERE release_id = $1", [release.rows[0].id]);
    return Response.json({ rating: aggregate.rows[0].rating, ratingCount: aggregate.rows[0].count });
  } catch (error) {
    console.error("[POST rating]", error);
    return Response.json({ error: "Rating gagal disimpan." }, { status: 503 });
  }
}
