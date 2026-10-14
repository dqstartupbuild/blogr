import { stripMdxFrontmatter } from "./stripMdxFrontmatter";

export const countBlogWords = (mdx: string) => {
  const plainText = stripMdxFrontmatter(mdx)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_`~|[\](){}-]/g, " ");

  return plainText
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
};
