import { rebuildManagedBlogImagesInMdx } from "./rebuildManagedBlogImagesInMdx";
import { withBlogImageSectionHeadings } from "./withBlogImageSectionHeadings";
import type { BlogImageChanges } from "../types/BlogImageChanges";
import type { BlogImageItem } from "../types/BlogImageItem";

type BuildBlogImageRemovalChangesOptions = {
  imageIndex: number;
  images: BlogImageItem[];
  mdx: string;
  title: string;
};

export const buildBlogImageRemovalChanges = ({
  imageIndex,
  images,
  mdx,
  title,
}: BuildBlogImageRemovalChangesOptions): BlogImageChanges => {
  const positionedImages = withBlogImageSectionHeadings({ images, mdx, title });
  const nextImages = positionedImages.filter((_, index) => index !== imageIndex);

  if (imageIndex === 0 && nextImages[0]) {
    nextImages[0] = {
      ...nextImages[0],
      sectionHeading: title,
      sectionIndex: undefined,
    };
  }

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
