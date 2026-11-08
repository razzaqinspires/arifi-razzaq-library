import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

export async function getVisitorId() {
  const store = await cookies();
  const existing = store.get("ar_creator_visitor")?.value;
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  const id = randomUUID();
  store.set("ar_creator_visitor", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}
