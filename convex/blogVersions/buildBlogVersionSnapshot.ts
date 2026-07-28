import type { Doc } from "../_generated/dataModel";

export const buildBlogVersionSnapshot = (
  blog: Doc<"blogs">,
  archivedAt: number,
  versionNumber: number,
) => {
  return {
    archivedAt,
    blogCreatedAt: blog.createdAt,
    blogId: blog._id,
    blogUpdatedAt: blog.updatedAt,
    excerpt: blog.excerpt,
    featureImageUrl: blog.featureImageUrl,
    images: blog.images,
    internalLinks: blog.internalLinks,
    keyword: blog.keyword,
    mdx: blog.mdx,
    productId: blog.productId,
    publishedAt: blog.publishedAt,
    seoTitle: blog.seoTitle,
    slug: blog.slug,
    sources: blog.sources,
    status: blog.status,
    tags: blog.tags,
    title: blog.title,
    topicId: blog.topicId,
    userId: blog.userId,
    versionNumber,
    youtubeVideos: blog.youtubeVideos,
  };
};
