import { rebuildManagedBlogImagesInMdx } from "./rebuildManagedBlogImagesInMdx";
import { withBlogImageSectionHeadings } from "./withBlogImageSectionHeadings";
import type { BlogImageChanges } from "../types/BlogImageChanges";
import type { BlogImageItem } from "../types/BlogImageItem";

type BuildBlogImageAltChangesOptions = {
  alt: string;
  imageIndex: number;
  images: BlogImageItem[];
  mdx: string;
  title: string;
};

export const buildBlogImageAltChanges = ({
  alt,
  imageIndex,
  images,
  mdx,
  title,
}: BuildBlogImageAltChangesOptions): BlogImageChanges => {
  const positionedImages = withBlogImageSectionHeadings({ images, mdx, title });
  const nextImages = positionedImages.map((image, index) =>
    index === imageIndex ? { ...image, alt: alt.trim() } : image,
  );

  return {
    featureImageUrl: nextImages[0]?.url,
    images: nextImages,
    mdx: rebuildManagedBlogImagesInMdx({
      mdx,
      nextImages,
      previousImages: images,
    }),
  };
};
