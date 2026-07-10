import { getBlogImageSectionHeading } from "./getBlogImageSectionHeading";
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
  return images.map((image, index) => ({
    ...image,
    sectionHeading:
      index === 0
        ? title
        : getBlogImageSectionHeading({ mdx, url: image.url }) ||
          image.sectionHeading ||
          "",
  }));
};
