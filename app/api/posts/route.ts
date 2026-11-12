import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = (searchParams.get("q") ?? "").trim().slice(0, 120);
    const kind = searchParams.get("kind") ?? "";
    const category = (searchParams.get("category") ?? "").trim().slice(0, 80);
    const values: unknown[] = [];
    const where = ["p.published = TRUE"];

    if (searchTerm) {
      values.push(`%${searchTerm.replace(/[\\%_]/g, "\\$&")}%`);
      const position = values.length;
      where.push(`(p.title ILIKE $${position} ESCAPE '\\' OR p.excerpt ILIKE $${position} ESCAPE '\\' OR p.content ILIKE $${position} ESCAPE '\\' OR p.category ILIKE $${position} ESCAPE '\\' OR EXISTS (SELECT 1 FROM unnest(p.tags) tag WHERE tag ILIKE $${position} ESCAPE '\\'))`);
    }
    if (["journal", "community", "announcement"].includes(kind)) {
      values.push(kind);
      where.push(`p.kind = $${values.length}`);
    }
    if (category && category !== "Semua") {
      values.push(category);
      where.push(`p.category = $${values.length}`);
    }

    const result = await query(
      `SELECT p.id::int AS id, p.title, p.slug, p.excerpt, p.kind, p.category, p.tags,
              p.cover_image_url AS "coverImageUrl", p.external_url AS "externalUrl",
              p.featured, p.published, p.created_at AS "createdAt", p.updated_at AS "updatedAt",
              COUNT(DISTINCT c.id)::int AS "commentsCount"
       FROM posts p
       LEFT JOIN post_comments c ON c.post_id = p.id AND c.status = 'approved'
       WHERE ${where.join(" AND ")}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT 80`,
      values,
    );
    const categories = await query<{ category: string }>(
      `SELECT DISTINCT category FROM posts WHERE published = TRUE ${kind && ["journal", "community", "announcement"].includes(kind) ? "AND kind = $1" : ""} ORDER BY category ASC`, 
      kind && ["journal", "community", "announcement"].includes(kind) ? [kind] : [],
    );
    return Response.json({ posts: result.rows, categories: categories.rows.map((row) => row.category) });
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return Response.json({ error: "Post belum dapat dimuat. Periksa konfigurasi database." }, { status: 503 });
  }
}
