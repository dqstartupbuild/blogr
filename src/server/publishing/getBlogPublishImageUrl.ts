import type { BlogItem } from "@/features/workspace/types/BlogItem";

export const getBlogPublishImageUrl = (blog: BlogItem) => {
  return blog.featureImageUrl || blog.images[0]?.url || "";
};
