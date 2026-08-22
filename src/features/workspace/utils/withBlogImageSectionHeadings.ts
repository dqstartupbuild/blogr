import { getBlogImageSectionHeading } from "./getBlogImageSectionHeading";
import { getBlogImageSectionIndex } from "./getBlogImageSectionIndex";
import type { BlogImageItem } from "../types/BlogImageItem";

type WithBlogImageSectionHeadingsOptions = {
  images: BlogImageItem[];
  mdx: string;
  title: string;
};

export const withBlogImageSectionHeadings = ({
  images,
  mdx,
  title,
}: WithBlogImageSectionHeadingsOptions) => {
  return images.map((image, index) =>
    index === 0
      ? { ...image, sectionHeading: title, sectionIndex: undefined }
      : {
          ...image,
          sectionHeading:
            getBlogImageSectionHeading({ mdx, url: image.url }) ||
            image.sectionHeading ||
            "",
          sectionIndex:
            getBlogImageSectionIndex(mdx, image.url) ?? image.sectionIndex,
        },
  );
};
