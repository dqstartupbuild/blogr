import { storeLocalImage } from "@/local/server/storeLocalImage";
export const storeProductScanImageUrls = async ({ urls }: { category?: string; filenamePrefix?: string; token?: string; urls: string[]; userId?: string }) => {
  const saved = await Promise.all(urls.map(async (url) => { try { return await storeLocalImage(url); } catch { return ""; } }));
  return { keys: [], urls: saved.filter(Boolean) };
};
