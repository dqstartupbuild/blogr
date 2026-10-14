export const stripMdxFrontmatter = (mdx: string) => {
  return mdx.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, "");
};
