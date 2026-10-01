import type { BlogItem } from "../types/BlogItem";

type LocalBlogSummaryLike = {
  blogId: string;
  createdAt?: number;
  excerpt: string;
  featureImageUrl?: string;
  keyword: string;
  productId?: string;
  publishedAt?: number;
  seoTitle?: string;
  slug: string;
  status: BlogItem["status"];
  tags?: string[];
  title: string;
  updatedAt: number;
  wordCount?: number;
};

export const mapLocalBlogSummary = (
  blog: LocalBlogSummaryLike,
): BlogItem => {
  return {
    createdAt: blog.createdAt,
    excerpt: blog.excerpt,
    featureImageUrl: blog.featureImageUrl,
    id: blog.blogId,
    images: [],
    internalLinks: [],
    isSummary: true,
    keyword: blog.keyword,
    mdx: "",
    productId: blog.productId,
    publishedAt: blog.publishedAt,
    seoTitle: blog.seoTitle || blog.title,
    slug: blog.slug,
    sources: [],
    status: blog.status,
    tags: blog.tags || [],
    title: blog.title,
    updatedAt: blog.updatedAt,
    wordCount: blog.wordCount,
    youtubeVideos: [],
  };
};
