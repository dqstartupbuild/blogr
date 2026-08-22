import { getBlogSectionHeadings } from "./getBlogSectionHeadings";

export const findBlogSectionIndex = (mdx: string, sectionHeading: string) => {
  const sectionIndex = getBlogSectionHeadings(mdx).findIndex(
    (heading) => heading === sectionHeading,
  );

  return sectionIndex >= 0 ? sectionIndex : undefined;
};
