import { put, head } from "@vercel/blob";
import type { PortfolioData } from "./types";
import { DEFAULT_DATA } from "./defaultData";

const BLOB_PATHNAME = "portfolio/data.json";

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return DEFAULT_DATA;

    const res = await fetch(
      `https://blob.vercel-storage.com/${BLOB_PATHNAME}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!res.ok) return DEFAULT_DATA;
    return (await res.json()) as PortfolioData;
  } catch {
    return DEFAULT_DATA;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}
