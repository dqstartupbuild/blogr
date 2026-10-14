import { applyBlogImagesToMdx } from "@/server/blog/applyBlogImagesToMdx";
import { removeManagedBlogImagesFromMdx } from "./removeManagedBlogImagesFromMdx";
import type { BlogImageItem } from "../types/BlogImageItem";

type RebuildManagedBlogImagesInMdxOptions = {
  mdx: string;
  nextImages: BlogImageItem[];
  previousImages: BlogImageItem[];
};

export const rebuildManagedBlogImagesInMdx = ({
  mdx,
  nextImages,
  previousImages,
}: RebuildManagedBlogImagesInMdxOptions) => {
  const withoutManagedImages = removeManagedBlogImagesFromMdx(mdx, [
    ...previousImages,
    ...nextImages,
  ]);

  return applyBlogImagesToMdx({
    images: nextImages,
    mdx: withoutManagedImages,
  });
};
