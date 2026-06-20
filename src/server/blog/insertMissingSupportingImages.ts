import { buildMarkdownImage } from "./buildMarkdownImage";
import { getMarkdownImageUrls } from "./getMarkdownImageUrls";
import type { BlogImage } from "./types/BlogImage";

type InsertMissingSupportingImagesOptions = {
  images: BlogImage[];
  mdx: string;
};

export const insertMissingSupportingImages = ({
  images,
  mdx,
}: InsertMissingSupportingImagesOptions) => {
  const existingUrls = new Set(getMarkdownImageUrls(mdx));
  const supportingImages = images
    .slice(1)
    .filter((image) => image.url && !existingUrls.has(image.url));

  if (supportingImages.length === 0) return mdx;

  const lines = mdx.split("\n");
  const headingIndexes = lines
    .map((line, index) => (/^##\s+/.test(line) ? index : -1))
    .filter((index) => index >= 0);

  if (headingIndexes.length === 0) {
    return `${mdx.trimEnd()}\n\n${supportingImages
      .map(buildMarkdownImage)
      .join("\n\n")}\n`;
  }

  const insertions = supportingImages.map((image, index) => {
    const headingIndex =
      headingIndexes[Math.min(index, headingIndexes.length - 1)] ?? lines.length - 1;

    return {
      image,
      lineIndex: headingIndex + 1,
    };
  });

  insertions.reverse().forEach(({ image, lineIndex }) => {
    lines.splice(lineIndex, 0, "", buildMarkdownImage(image), "");
  });

  return lines.join("\n");
};
