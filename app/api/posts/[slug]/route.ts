import { query } from "@/lib/db";

export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params;
  try {
    const result = await query(
      `SELECT p.id::int AS id, p.title, p.slug, p.excerpt, p.content, p.kind, p.category, p.tags,
              p.cover_image_url AS "coverImageUrl", p.external_url AS "externalUrl",
              p.featured, p.published, p.created_at AS "createdAt", p.updated_at AS "updatedAt",
              COUNT(DISTINCT c.id)::int AS "commentsCount"
       FROM posts p
       LEFT JOIN post_comments c ON c.post_id = p.id AND c.status = 'approved'
       WHERE p.slug = $1 AND p.published = TRUE
       GROUP BY p.id`,
      [slug],
    );
    if (!result.rowCount) return Response.json({ error: "Post tidak ditemukan." }, { status: 404 });
    const comments = await query(
      `SELECT id::int AS id, name, body, created_at AS "createdAt"
       FROM post_comments WHERE post_id = $1 AND status = 'approved'
       ORDER BY created_at DESC LIMIT 100`,
      [result.rows[0].id],
    );
    return Response.json({ post: { ...result.rows[0], comments: comments.rows } });
  } catch (error) {
    console.error("[GET /api/posts/:slug]", error);
    return Response.json({ error: "Detail post gagal dimuat." }, { status: 503 });
  }
}
