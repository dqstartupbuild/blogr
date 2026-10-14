import { getImageUrlPathKey } from "./getImageUrlPathKey";
import type { BlogImageItem } from "../types/BlogImageItem";

const markdownImagePattern = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

export const removeManagedBlogImagesFromMdx = (
  mdx: string,
  images: BlogImageItem[],
) => {
  if (images.length === 0) {
    return mdx;
  }

  const managedUrls = new Set(images.map((image) => image.url));
  const managedPathKeys = new Set(
    images.map((image) => getImageUrlPathKey(image.url)).filter(Boolean),
  );

  return mdx
    .split("\n")
    .map((line) => {
      if (/^featureImage:\s*/.test(line)) {
        return "";
      }

      return line.replace(markdownImagePattern, (markdownImage, url: string) => {
        const isManaged =
          managedUrls.has(url) || managedPathKeys.has(getImageUrlPathKey(url));

        return isManaged ? "" : markdownImage;
      });
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
};
