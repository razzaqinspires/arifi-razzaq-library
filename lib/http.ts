import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken } from "@/lib/auth";

export async function isAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(adminCookieName())?.value);
}

export function validHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
