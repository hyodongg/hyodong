import { setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "비밀번호가 틀렸어요" }, { status: 401 });
  }

  await setAuthCookie();
  return Response.json({ ok: true });
}
