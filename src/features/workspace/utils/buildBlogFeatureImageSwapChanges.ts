import { rebuildManagedBlogImagesInMdx } from "./rebuildManagedBlogImagesInMdx";
import { withBlogImageSectionHeadings } from "./withBlogImageSectionHeadings";
import type { BlogImageChanges } from "../types/BlogImageChanges";
import type { BlogImageItem } from "../types/BlogImageItem";

type BuildBlogFeatureImageSwapChangesOptions = {
  imageIndex: number;
  images: BlogImageItem[];
  mdx: string;
  title: string;
};

export const buildBlogFeatureImageSwapChanges = ({
  imageIndex,
  images,
  mdx,
  title,
}: BuildBlogFeatureImageSwapChangesOptions): BlogImageChanges => {
  const positionedImages = withBlogImageSectionHeadings({ images, mdx, title });
  const currentFeatureImage = positionedImages[0];
  const selectedImage = positionedImages[imageIndex];

  if (!currentFeatureImage || !selectedImage || imageIndex === 0) {
    return {
      featureImageUrl: currentFeatureImage?.url,
      images: positionedImages,
      mdx,
    };
  }

  const selectedSectionHeading = selectedImage.sectionHeading || "";
  const nextImages = [...positionedImages];
  nextImages[0] = {
    ...selectedImage,
    sectionHeading: title,
    sectionIndex: undefined,
  };
  nextImages[imageIndex] = {
    ...currentFeatureImage,
    sectionHeading: selectedSectionHeading,
    sectionIndex: selectedImage.sectionIndex,
  };

  return {
    featureImageUrl: nextImages[0].url,
    images: nextImages,
    mdx: rebuildManagedBlogImagesInMdx({
      mdx,
      nextImages,
      previousImages: images,
    }),
  };
};
