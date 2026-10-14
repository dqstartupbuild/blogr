import { removeManagedBlogImagesFromMdx } from "./removeManagedBlogImagesFromMdx";
import type { BlogImageItem } from "../types/BlogImageItem";

export const getBlogMdxEditorValue = (
  mdx: string,
  images: BlogImageItem[],
) => removeManagedBlogImagesFromMdx(mdx, images);
