import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { getBlogFeatureImage } from "@/server/blog/getBlogFeatureImage";

export const getBlogPublishImageUrl = (blog: BlogItem) => {
  return blog.featureImageUrl || getBlogFeatureImage(blog.images)?.url || "";
};
