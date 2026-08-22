import { insertMissingFeatureImage } from "./insertMissingFeatureImage";
import { getBlogFeatureImage } from "./getBlogFeatureImage";
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
  const featureImage = getBlogFeatureImage(images);
  const withFeatureImage = setMdxFeatureImage(mdx, featureImage?.url);
  const withFeatureImageMarkdown = insertMissingFeatureImage({
    image: featureImage,
    mdx: withFeatureImage,
  });

  return normalizeBlogMdxImages({
    images,
    mdx: withFeatureImageMarkdown,
  });
};
