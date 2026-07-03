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
    return JSON.parse(text) as PortfolioData;
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
