import { createAdminToken, adminCookieName, adminCookieOptions, safeSecretEqual } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const configured = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.SESSION_SECRET;
    if (!configured || !sessionSecret || sessionSecret.length < 32) {
      return Response.json({ error: "ADMIN_PASSWORD dan SESSION_SECRET belum dikonfigurasi dengan benar." }, { status: 503 });
    }
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    if (!safeSecretEqual(configured, password)) return Response.json({ error: "Password tidak sesuai." }, { status: 401 });
    const response = Response.json({ ok: true });
    response.headers.append("Set-Cookie", `${adminCookieName()}=${createAdminToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    return response;
  } catch (error) {
    console.error("[admin login]", error);
    return Response.json({ error: "Login gagal." }, { status: 500 });
  }
}
