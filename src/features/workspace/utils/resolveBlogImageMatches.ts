import { getImageUrlPathKey } from "./getImageUrlPathKey";
import { getMarkdownImageUrls } from "./getMarkdownImageUrls";
import type { BlogImageItem } from "../types/BlogImageItem";

export type ResolvedBlogImageMatch = {
  imageIndex: number;
  prompt: string;
  alt: string;
};

type ResolveBlogImageMatchesOptions = {
  images: BlogImageItem[];
  mdx: string;
};

export const resolveBlogImageMatches = ({
  images,
  mdx,
}: ResolveBlogImageMatchesOptions): Map<string, ResolvedBlogImageMatch> => {
  const matches = new Map<string, ResolvedBlogImageMatch>();

  if (images.length === 0) {
    return matches;
  }

  const urlToIndex = new Map<string, number>();
  const pathKeyToIndex = new Map<string, number>();

  images.forEach((image, index) => {
    if (image.url && !urlToIndex.has(image.url)) {
      urlToIndex.set(image.url, index);
    }

    const pathKey = getImageUrlPathKey(image.url);

    if (pathKey && !pathKeyToIndex.has(pathKey)) {
      pathKeyToIndex.set(pathKey, index);
    }
  });

  const markdownUrls = getMarkdownImageUrls(mdx);
  const usedIndexes = new Set<number>();

  const assign = (src: string, index: number) => {
    const image = images[index];

    if (!image || matches.has(src)) {
      return;
    }

    usedIndexes.add(index);
    matches.set(src, {
      alt: image.alt,
      imageIndex: index,
      prompt: image.prompt,
    });
  };

  // First pass: match each markdown image by exact URL or stable path key.
  markdownUrls.forEach((src) => {
    if (matches.has(src)) {
      return;
    }

    const exactIndex = urlToIndex.get(src);

    if (typeof exactIndex === "number") {
      assign(src, exactIndex);
      return;
    }

    const pathIndex = pathKeyToIndex.get(getImageUrlPathKey(src));

    if (typeof pathIndex === "number") {
      assign(src, pathIndex);
    }
  });

  // Second pass: fall back to order so any remaining markdown image still maps
  // to an unused blog image prompt.
  let nextImageIndex = 0;

  markdownUrls.forEach((src) => {
    if (matches.has(src)) {
      return;
    }

    while (nextImageIndex < images.length && usedIndexes.has(nextImageIndex)) {
      nextImageIndex += 1;
    }

    if (nextImageIndex < images.length) {
      assign(src, nextImageIndex);
      nextImageIndex += 1;
    }
  });

  return matches;
};