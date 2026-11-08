import { db } from "@/lib/db";
import { getVisitorId } from "@/lib/visitor";

export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: Context) {
  const { slug } = await context.params;
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 48) : "";
    const message = typeof body.body === "string" ? body.body.trim().slice(0, 1200) : "";
    if (name.length < 2 || message.length < 3) return Response.json({ error: "Nama dan komentar harus diisi." }, { status: 400 });
    const release = await db.query("SELECT id FROM releases WHERE slug = $1", [slug]);
    if (!release.rowCount) return Response.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    const visitorId = await getVisitorId();
    const result = await db.query(
      `INSERT INTO release_comments (release_id, visitor_id, name, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, body, created_at AS "createdAt"`,
      [release.rows[0].id, visitorId, name, message],
    );
    return Response.json({ comment: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST comment]", error);
    return Response.json({ error: "Komentar gagal dikirim." }, { status: 503 });
  }
}
