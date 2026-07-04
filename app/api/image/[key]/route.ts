import { getPortfolioData, getProjectImageStream } from "@/lib/blob";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const data = await getPortfolioData();
  const blobUrl = data.projectImages[key];
  if (!blobUrl) {
    return new Response("Not found", { status: 404 });
  }

  const image = await getProjectImageStream(blobUrl);
  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(image.stream, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
