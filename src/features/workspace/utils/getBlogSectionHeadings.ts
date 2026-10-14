export const getBlogSectionHeadings = (mdx: string) => {
  return mdx
    .split("\n")
    .map((line) => line.match(/^##\s+(.+)$/)?.[1]?.trim() || "")
    .filter(Boolean);
};
