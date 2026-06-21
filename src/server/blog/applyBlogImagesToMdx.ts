import { insertMissingFeatureImage } from "./insertMissingFeatureImage";
import { normalizeBlogMdxImages } from "./normalizeBlogMdxImages";
import { setMdxFeatureImage } from "./setMdxFeatureImage";
import type { BlogImage } from "./types/BlogImage";

type ApplyBlogImagesToMdxOptions = {
  images: BlogImage[];
  mdx: string;
};

export const applyBlogImagesToMdx = ({
  images,
  mdx,
}: ApplyBlogImagesToMdxOptions) => {
  const withFeatureImage = setMdxFeatureImage(mdx, images[0]?.url);
  const withFeatureImageMarkdown = insertMissingFeatureImage({
    image: images[0],
    mdx: withFeatureImage,
  });

  return normalizeBlogMdxImages({
    images,
    mdx: withFeatureImageMarkdown,
  });
};
