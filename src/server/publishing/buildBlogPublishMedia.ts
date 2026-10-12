import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { detectRasterImageFormat } from "../../../shared/raster/detectRasterImageFormat";
import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { getLocalHome } from "@/local/server/getLocalHome";

const localMediaPattern = /\/api\/local\/media\/([a-f0-9-]{36}\.(?:png|jpg|webp|gif))/g;
const maxMediaCount = 20;
const maxTotalBytes = 2 * 1024 * 1024;

export type BlogPublishMedia = {
  content_type: "image/gif" | "image/jpeg" | "image/png" | "image/webp";
  data_base64: string;
  source_url: string;
};

export const buildBlogPublishMedia = async (
  blog: BlogItem,
): Promise<BlogPublishMedia[]> => {
  const sources = new Set<string>();
  const content = `${blog.mdx}\n${blog.featureImageUrl || ""}\n${blog.images.map((image) => image.url).join("\n")}`;
  for (const match of content.matchAll(localMediaPattern)) {
    sources.add(`/api/local/media/${match[1]}`);
  }
  if (sources.size > maxMediaCount) {
    throw new Error(`This article has more than ${maxMediaCount} locally stored images. Reduce the image count before publishing.`);
  }

  let totalBytes = 0;
  const media: BlogPublishMedia[] = [];
  for (const sourceUrl of sources) {
    const fileName = sourceUrl.slice("/api/local/media/".length);
    const bytes = await readFile(join(getLocalHome(), "media", fileName));
    totalBytes += bytes.byteLength;
    if (totalBytes > maxTotalBytes) {
      throw new Error("This article's local images exceed the 10 MB publishing limit. Reduce or resize the images before publishing.");
    }
    const format = detectRasterImageFormat(bytes);
    if (!format) throw new Error(`The local image ${fileName} is not a supported PNG, JPEG, GIF, or WebP file.`);
    media.push({
      content_type: format.contentType,
      data_base64: bytes.toString("base64"),
      source_url: sourceUrl,
    });
  }
  return media;
};
