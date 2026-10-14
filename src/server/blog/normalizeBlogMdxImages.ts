import { insertMissingSupportingImages } from "./insertMissingSupportingImages";
import { removeDuplicateMarkdownImages } from "./removeDuplicateMarkdownImages";
import type { BlogImage } from "./types/BlogImage";

type NormalizeBlogMdxImagesOptions = {
  images: BlogImage[];
  mdx: string;
};

export const normalizeBlogMdxImages = ({
  images,
  mdx,
}: NormalizeBlogMdxImagesOptions) => {
  const withoutDuplicates = removeDuplicateMarkdownImages(mdx);

  return insertMissingSupportingImages({
    images,
    mdx: withoutDuplicates,
  });
};
