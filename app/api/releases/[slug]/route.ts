import { query } from "@/lib/db";
import { getVisitorId } from "@/lib/visitor";

export const runtime = "nodejs";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params;
  try {
    const release = await query(
      `SELECT r.id::int AS id, r.title, r.slug, r.short_description AS "shortDescription", r.description,
              r.category, r.version, r.file_size AS "fileSize", r.file_name AS "fileName",
              r.download_url AS "downloadUrl", r.video_url AS "videoUrl",
              r.thumbnail_url AS "thumbnailUrl", r.tags, r.changelog, r.featured,
              r.downloads::int AS downloads, r.created_at AS "createdAt",
              COUNT(DISTINCT l.id)::int AS likes,
              ROUND(AVG(rt.score)::numeric, 1)::float AS rating,
              COUNT(DISTINCT rt.id)::int AS "ratingCount"
       FROM releases r
       LEFT JOIN release_likes l ON l.release_id = r.id
       LEFT JOIN release_ratings rt ON rt.release_id = r.id
       WHERE r.slug = $1
       GROUP BY r.id`,
      [slug],
    );
    if (!release.rowCount) return Response.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    const visitorId = await getVisitorId();
    const [viewerLike, viewerRating] = await Promise.all([
      query("SELECT 1 FROM release_likes WHERE release_id = $1 AND visitor_id = $2", [release.rows[0].id, visitorId]),
      query("SELECT score FROM release_ratings WHERE release_id = $1 AND visitor_id = $2", [release.rows[0].id, visitorId]),
    ]);
    const comments = await query(
      `SELECT id::int AS id, name, body, created_at AS "createdAt"
       FROM release_comments WHERE release_id = $1 AND status = 'approved'
       ORDER BY created_at DESC LIMIT 100`,
      [release.rows[0].id],
    );
    return Response.json({ release: { ...release.rows[0], viewerLiked: Boolean(viewerLike.rowCount), viewerRating: viewerRating.rows[0]?.score ?? 0, comments: comments.rows } });
  } catch (error) {
    console.error("[GET /api/releases/:slug]", error);
    return Response.json({ error: "Detail konten gagal dimuat." }, { status: 503 });
  }
}
