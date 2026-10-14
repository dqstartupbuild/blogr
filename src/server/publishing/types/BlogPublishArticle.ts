export type BlogPublishArticle = {
  content_format: "mdx";
  content_html: string;
  content_markdown: string;
  content_mdx: string;
  created_at: string;
  id: string;
  image_url: string;
  media?: Array<{
    content_type: "image/gif" | "image/jpeg" | "image/png" | "image/webp";
    data_base64: string;
    source_url: string;
  }>;
  meta_description: string;
  seo_title: string;
  slug: string;
  source: string;
  tags: string[];
  title: string;
  updated_at: string;
};
