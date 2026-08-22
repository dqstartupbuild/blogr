import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { buildBlogTags } from "@/server/blog/tags/buildBlogTags";
import { appendBlogTag } from "@/server/blog/tags/appendBlogTag";
import { maxBlogTagCount } from "@/server/blog/tags/constants/blogTagLimits";

export const buildBlogPublishTags = (blog: BlogItem) => {
  const tags: string[] = [];

  for (const tag of blog.tags) {
    appendBlogTag(tags, tag);
  }

  for (const tag of buildBlogTags({
    excerpt: blog.excerpt,
    keyword: blog.keyword,
    seoTitle: blog.seoTitle,
    title: blog.title,
  })) {
    appendBlogTag(tags, tag);
  }

  return tags.slice(0, maxBlogTagCount);
};
