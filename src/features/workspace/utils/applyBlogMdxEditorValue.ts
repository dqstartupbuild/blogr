import { rebuildManagedBlogImagesInMdx } from "./rebuildManagedBlogImagesInMdx";
import { withBlogImageSectionHeadings } from "./withBlogImageSectionHeadings";
import type { BlogImageItem } from "../types/BlogImageItem";

type ApplyBlogMdxEditorValueOptions = {
  currentMdx: string;
  editableMdx: string;
  images: BlogImageItem[];
  title: string;
};

export const applyBlogMdxEditorValue = ({
  currentMdx,
  editableMdx,
  images,
  title,
}: ApplyBlogMdxEditorValueOptions) => {
  const positionedImages = withBlogImageSectionHeadings({
    images,
    mdx: currentMdx,
    title,
  });

  return rebuildManagedBlogImagesInMdx({
    mdx: editableMdx,
    nextImages: positionedImages,
    previousImages: images,
  });
};
