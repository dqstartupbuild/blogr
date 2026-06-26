import { v } from "convex/values";

export const blogPublishArticleValidator = v.object({
  content_format: v.literal("mdx"),
  content_html: v.string(),
  content_markdown: v.string(),
  content_mdx: v.string(),
  created_at: v.string(),
  id: v.string(),
  image_url: v.string(),
  meta_description: v.string(),
  seo_title: v.string(),
  slug: v.string(),
  source: v.string(),
  tags: v.array(v.string()),
  title: v.string(),
  updated_at: v.string(),
});
