import { rebuildManagedBlogImagesInMdx } from "./rebuildManagedBlogImagesInMdx";
import { withBlogImageSectionHeadings } from "./withBlogImageSectionHeadings";
import type { BlogImageChanges } from "../types/BlogImageChanges";
import type { BlogImageItem } from "../types/BlogImageItem";

type BuildBlogImageMoveChangesOptions = {
  imageIndex: number;
  images: BlogImageItem[];
  mdx: string;
  sectionHeading: string;
  title: string;
};

export const buildBlogImageMoveChanges = ({
  imageIndex,
  images,
  mdx,
  sectionHeading,
  title,
}: BuildBlogImageMoveChangesOptions): BlogImageChanges => {
  const positionedImages = withBlogImageSectionHeadings({ images, mdx, title });
  const nextImages = positionedImages.map((image, index) =>
    index === imageIndex ? { ...image, sectionHeading } : image,
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
