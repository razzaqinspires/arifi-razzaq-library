import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") ?? "").trim().slice(0, 120);
    const category = (searchParams.get("category") ?? "").trim().slice(0, 80);
    const sort = searchParams.get("sort") ?? "newest";
    const sortOrders = {
      newest: "r.featured DESC, r.created_at DESC",
      downloads: "r.downloads DESC, r.created_at DESC",
      likes: "COUNT(DISTINCT l.id) DESC, r.created_at DESC",
      rating: "AVG(rt.score) DESC NULLS LAST, COUNT(DISTINCT rt.id) DESC, r.created_at DESC",
    } as const;
    const orderBy = sortOrders[sort as keyof typeof sortOrders] ?? sortOrders.newest;
    const values: unknown[] = [];
    const where: string[] = [];
    if (query) {
      values.push(`%${query.replace(/[\\%_]/g, "\\$&")}%`);
      where.push(`(r.title ILIKE $${values.length} ESCAPE '\\' OR r.short_description ILIKE $${values.length} ESCAPE '\\' OR r.description ILIKE $${values.length} ESCAPE '\\' OR r.version ILIKE $${values.length} ESCAPE '\\' OR r.slug ILIKE $${values.length} ESCAPE '\\' OR EXISTS (SELECT 1 FROM unnest(r.tags) tag WHERE tag ILIKE $${values.length} ESCAPE '\\'))`);
    }
    if (category && category !== "Semua") {
      values.push(category);
      where.push(`r.category = $${values.length}`);
    }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const result = await query(
      `SELECT r.id::int AS id, r.title, r.slug, r.short_description AS "shortDescription", r.category,
              r.version, r.file_size AS "fileSize", r.thumbnail_url AS "thumbnailUrl",
              r.featured, r.downloads::int AS downloads, r.created_at AS "createdAt",
              COUNT(DISTINCT l.id)::int AS likes,
              ROUND(AVG(rt.score)::numeric, 1)::float AS rating,
              COUNT(DISTINCT rt.id)::int AS "ratingCount"
       FROM releases r
       LEFT JOIN release_likes l ON l.release_id = r.id
       LEFT JOIN release_ratings rt ON rt.release_id = r.id
       ${clause}
       GROUP BY r.id
       ORDER BY ${orderBy}`,
      values,
    );
    const categories = await query("SELECT DISTINCT category FROM releases ORDER BY category ASC");
    return Response.json({ releases: result.rows, categories: categories.rows.map((row) => row.category) });
  } catch (error) {
    console.error("[GET /api/releases]", error);
    return Response.json({ error: "Library belum dapat dimuat. Periksa konfigurasi database." }, { status: 503 });
  }
}
