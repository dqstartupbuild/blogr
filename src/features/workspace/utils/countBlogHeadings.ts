import { stripMdxFrontmatter } from "./stripMdxFrontmatter";

export const countBlogHeadings = (mdx: string) => {
  return stripMdxFrontmatter(mdx)
    .split("\n")
    .filter((line) => /^#{1,6}\s+\S/.test(line.trim())).length;
};
