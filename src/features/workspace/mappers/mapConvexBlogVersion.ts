import type { Doc } from "../../../../convex/_generated/dataModel";
import { countBlogWords } from "../utils/countBlogWords";
import type { ArticleVersionItem } from "../types/ArticleVersionItem";

export const mapConvexBlogVersion = (
  version: Doc<"blogVersions">,
): ArticleVersionItem => {
  return {
    archivedAt: version.archivedAt,
    createdAt: version.blogCreatedAt,
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
    updatedAt: version.blogUpdatedAt,
    versionNumber: version.versionNumber,
    wordCount: countBlogWords(version.mdx),
    youtubeVideos: version.youtubeVideos,
  };
};
