export const countBlogWordsFromMdx = (mdx: string) => {
  return mdx
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-[\]()`]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
};
