export const buildBlogSearchText = ({
  excerpt,
  keyword,
  seoTitle,
  title,
}: {
  excerpt: string;
  keyword: string;
  seoTitle?: string;
  title: string;
}) => {
  return [keyword, title, seoTitle || "", excerpt]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};
