import { put, get } from "@vercel/blob";
import type { PortfolioData } from "./types";
import { DEFAULT_DATA } from "./defaultData";

const BLOB_PATHNAME = "portfolio/data.json";

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return DEFAULT_DATA;

    const result = await get(BLOB_PATHNAME, { access: "private", token });
    if (!result || !result.stream) return DEFAULT_DATA;

    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text) as Partial<PortfolioData>;
    return { ...DEFAULT_DATA, ...parsed };
  } catch {
    return DEFAULT_DATA;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function uploadProjectImage(key: string, file: File): Promise<string> {
  const result = await put(`portfolio/images/${key}-${Date.now()}-${file.name}`, file, {
    access: "private",
    contentType: file.type || undefined,
    addRandomSuffix: false,
  });
  return result.url;
}

export async function getProjectImageStream(
  blobUrl: string
): Promise<{ stream: ReadableStream; contentType: string } | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const result = await get(blobUrl, { access: "private", token });
  if (!result || !result.stream) return null;

  return { stream: result.stream, contentType: result.blob.contentType };
}
