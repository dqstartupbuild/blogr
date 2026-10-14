import { countBlogWords } from "../utils/countBlogWords";
import type { ArticleVersionItem } from "../types/ArticleVersionItem";

export const mapLocalBlogVersion = (
  version: ArticleVersionItem & { blogId: string; blogCreatedAt?: number; blogUpdatedAt?: number },
): ArticleVersionItem => {
  return {
    archivedAt: version.archivedAt,
    createdAt: version.blogCreatedAt || version.createdAt,
    excerpt: version.excerpt,
    featureImageUrl: version.featureImageUrl,
    id: version.blogId,
    images: version.images,
    internalLinks: version.internalLinks,
    keyword: version.keyword,
    mdx: version.mdx,
    productId: version.productId,
    publishedAt: version.publishedAt,
    seoTitle: version.seoTitle || version.title,
    slug: version.slug,
    sources: version.sources,
    status: version.status,
    tags: version.tags || [],
    title: version.title,
    updatedAt: version.blogUpdatedAt || version.updatedAt,
    versionNumber: version.versionNumber,
    wordCount: countBlogWords(version.mdx),
    youtubeVideos: version.youtubeVideos,
  };
};
