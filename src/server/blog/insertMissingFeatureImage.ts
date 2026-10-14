import { buildMarkdownImage } from "./buildMarkdownImage";
import type { BlogImage } from "./types/BlogImage";

type InsertMissingFeatureImageOptions = {
  image?: BlogImage;
  mdx: string;
};

export const insertMissingFeatureImage = ({
  image,
  mdx,
}: InsertMissingFeatureImageOptions) => {
  if (!image?.url || mdx.includes(image.url)) {
    return mdx;
  }

  const lines = mdx.split("\n");
  const h1Index = lines.findIndex((line) => /^#\s+/.test(line));

  if (h1Index < 0) {
    return `${mdx.trimEnd()}\n\n${buildMarkdownImage(image)}\n`;
  }

  lines.splice(h1Index + 1, 0, "", buildMarkdownImage(image), "");

  return lines.join("\n");
};
