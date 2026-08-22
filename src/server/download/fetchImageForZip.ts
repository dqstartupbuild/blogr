import { getImageExtensionFromContentType } from "./getImageExtensionFromContentType";
import type { DownloadedImage } from "./types/DownloadedImage";

type FetchImageForZipOptions = {
  index: number;
  url: string;
};

export const fetchImageForZip = async ({
  index,
  url,
}: FetchImageForZipOptions): Promise<DownloadedImage | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "image/png";
    if (!contentType.startsWith("image/")) return null;

    const bytes = await response.arrayBuffer();
    const extension = getImageExtensionFromContentType(contentType);

    return {
      bytes,
      contentType,
      localPath: `images/image-${index}.${extension}`,
      originalUrl: url,
    };
  } catch {
    return null;
  }
};
