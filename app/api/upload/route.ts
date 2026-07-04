import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getPortfolioData, savePortfolioData, uploadProjectImage } from "@/lib/blob";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "인증이 필요해요" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const key = formData.get("key");

  if (!(file instanceof File) || typeof key !== "string" || !key) {
    return Response.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const url = await uploadProjectImage(key, file);

  const data = await getPortfolioData();
  data.projectImages = { ...data.projectImages, [key]: url };
  await savePortfolioData(data);
  revalidatePath("/");

  return Response.json({ url });
}
