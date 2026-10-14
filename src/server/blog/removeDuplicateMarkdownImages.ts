import { getMarkdownImageUrls } from "./getMarkdownImageUrls";

export const removeDuplicateMarkdownImages = (mdx: string) => {
  const seenUrls = new Set<string>();

  return mdx
    .split("\n")
    .filter((line) => {
      const urls = getMarkdownImageUrls(line);
      if (urls.length === 0) return true;

      const hasDuplicate = urls.some((url) => seenUrls.has(url));
      urls.forEach((url) => seenUrls.add(url));

      return !hasDuplicate;
    })
    .join("\n");
};
