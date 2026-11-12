import { query } from "@/lib/db";
import { isAdmin } from "@/lib/http";
import { parsePostInput } from "@/lib/post-input";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  try {
    const result = await query(
      `SELECT p.id::int AS id, p.title, p.slug, p.excerpt, p.content, p.kind, p.category, p.tags,
              p.cover_image_url AS "coverImageUrl", p.external_url AS "externalUrl",
              p.featured, p.published, p.created_at AS "createdAt", p.updated_at AS "updatedAt",
              COUNT(DISTINCT c.id)::int AS "commentsCount"
       FROM posts p LEFT JOIN post_comments c ON c.post_id = p.id
       GROUP BY p.id ORDER BY p.created_at DESC`,
    );
    return Response.json({ posts: result.rows });
  } catch (error) {
    console.error("[GET /api/admin/posts]", error);
    return Response.json({ error: "Daftar post gagal dimuat." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 401 });
  try {
    const parsed = parsePostInput(await request.json());
    if (!parsed.data) return Response.json({ error: parsed.error }, { status: 400 });
    const p = parsed.data;
    const result = await query(
      `INSERT INTO posts (title, slug, excerpt, content, kind, category, tags, cover_image_url, external_url, featured, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id::int AS id, slug, published`,
      [p.title, p.slug, p.excerpt, p.content, p.kind, p.category, p.tags, p.coverImageUrl, p.externalUrl, p.featured, p.published],
    );
    return Response.json({ ok: true, post: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/posts]", error);
    const message = error instanceof Error && error.message.includes("duplicate key") ? "Slug post sudah digunakan. Ubah slug terlebih dahulu." : "Post gagal disimpan.";
    return Response.json({ error: message }, { status: 500 });
  }
}
