import { db } from "@/lib/db";
import { validHttpUrl } from "@/lib/http";
import { NextResponse } from "next/server";

type Context = { params: Promise<{ slug: string }> };
export const runtime = "nodejs";

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params;
  try {
    const result = await db.query("SELECT download_url FROM releases WHERE slug = $1", [slug]);
    if (!result.rowCount || !validHttpUrl(result.rows[0].download_url)) {
      return NextResponse.json({ error: "Tautan unduhan tidak tersedia." }, { status: 404 });
    }
    await db.query("UPDATE releases SET downloads = downloads + 1, updated_at = NOW() WHERE slug = $1", [slug]);
    return NextResponse.redirect(result.rows[0].download_url, 302);
  } catch (error) {
    console.error("[download]", error);
    return NextResponse.json({ error: "Unduhan belum dapat diproses." }, { status: 503 });
  }
}
