import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPortfolioData();
  return Response.json(data);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "인증이 필요해요" }, { status: 401 });
  }

  const data = await request.json();
  await savePortfolioData(data);
  revalidatePath("/");
  return Response.json({ ok: true });
}
