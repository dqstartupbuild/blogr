import { getImageUrlPathKey } from "./getImageUrlPathKey";
import { getMarkdownImageUrls } from "./getMarkdownImageUrls";

export const getBlogImageSectionIndex = (mdx: string, url: string) => {
  const targetPathKey = getImageUrlPathKey(url);
  const lines = mdx.split("\n");
  const imageLineIndex = lines.findIndex((line) =>
    getMarkdownImageUrls(line).some(
      (imageUrl) =>
        imageUrl === url || getImageUrlPathKey(imageUrl) === targetPathKey,
    ),
  );

  if (imageLineIndex < 0) {
    return undefined;
  }

  const sectionCount = lines
    .slice(0, imageLineIndex)
    .filter((line) => /^##\s+/.test(line)).length;

  return sectionCount > 0 ? sectionCount - 1 : undefined;
};
