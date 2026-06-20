import type { BlogImage } from "./types/BlogImage";

export const buildMarkdownImage = (image: BlogImage) => {
  return `![${image.alt}](${image.url})`;
};
