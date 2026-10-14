import type { BlogItem } from "@/features/workspace/types/BlogItem";

export const buildBlogReadme = (blog: BlogItem) => {
  return `# ${blog.title}

Drop the MDX file into your blog content folder.

Images are in the \`images\` folder. Any image that could not be downloaded stays as its original remote URL in the MDX.

Keyword: ${blog.keyword}
Slug: ${blog.slug}
SEO title: ${blog.seoTitle || blog.title}
Meta description: ${blog.excerpt}
`;
};
