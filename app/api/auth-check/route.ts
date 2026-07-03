import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false }, { status: 401 });
  }
  return Response.json({ ok: true });
}
