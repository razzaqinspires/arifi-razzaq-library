import { isAdmin } from "@/lib/http";

export async function GET() {
  return Response.json({ authenticated: await isAdmin() });
}
