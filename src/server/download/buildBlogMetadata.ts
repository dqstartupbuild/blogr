import type { BlogItem } from "@/features/workspace/types/BlogItem";
import type { DownloadedImage } from "./types/DownloadedImage";

export const buildBlogMetadata = (
  blog: BlogItem,
  downloadedImages: DownloadedImage[],
) => {
  return JSON.stringify(
    {
      title: blog.title,
      slug: blog.slug,
      keyword: blog.keyword,
      excerpt: blog.excerpt,
      images: downloadedImages.map((image) => ({
        contentType: image.contentType,
        localPath: image.localPath,
        originalUrl: image.originalUrl,
      })),
      internalLinks: blog.internalLinks,
      youtubeVideos: blog.youtubeVideos,
      sources: blog.sources,
    },
    null,
    2,
  );
};
