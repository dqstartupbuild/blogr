import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getLocalHome } from "@/local/server/getLocalHome";
import { fetchPublicImage } from "@/local/server/fetchPublicImage";
import { getImageExtensionFromContentType } from "./getImageExtensionFromContentType";
import type { DownloadedImage } from "./types/DownloadedImage";
export const fetchImageForZip = async ({ index, url }: { index: number; url: string }): Promise<DownloadedImage | null> => {
  try {
    let bytes: Buffer; let contentType: string;
    if (url.startsWith("/api/local/media/")) {
      const name = url.slice("/api/local/media/".length);
      if (!/^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(name)) return null;
      bytes = await readFile(join(getLocalHome(), "media", name));
      const ext = name.split(".").pop(); contentType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    } else {
      ({ bytes, contentType } = await fetchPublicImage(url));
    }
    const extension = getImageExtensionFromContentType(contentType);
    return { bytes: Uint8Array.from(bytes).buffer, contentType, localPath: `images/image-${index}.${extension}`, originalUrl: url };
  } catch { return null; }
};
