import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { buildBlogPublishTags } from "./buildBlogPublishTags";
import { getBlogPublishImageUrl } from "./getBlogPublishImageUrl";
import { getBlogPublishSource } from "./getBlogPublishSource";
import type { BlogPublishArticle } from "./types/BlogPublishArticle";

type BuildBlogPublishArticleOptions = {
  publishTimestamp: string;
  sourceName?: string;
};

export const buildBlogPublishArticle = (
  blog: BlogItem,
  { publishTimestamp, sourceName }: BuildBlogPublishArticleOptions,
): BlogPublishArticle => {
  return {
    content_format: "mdx",
    content_html: "",
    content_markdown: blog.mdx,
    content_mdx: blog.mdx,
    created_at: publishTimestamp,
    id: blog.id,
    image_url: getBlogPublishImageUrl(blog),
    meta_description: blog.excerpt,
    seo_title: blog.seoTitle || blog.title,
    slug: blog.slug,
    source: getBlogPublishSource(sourceName),
    tags: buildBlogPublishTags(blog),
    title: blog.title,
    updated_at: publishTimestamp,
  };
};
