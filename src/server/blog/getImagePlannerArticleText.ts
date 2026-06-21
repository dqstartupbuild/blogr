export const getImagePlannerArticleText = (mdx: string) => {
  return mdx.replace(/^---[\s\S]*?---\s*/m, "").slice(0, 18000);
};
