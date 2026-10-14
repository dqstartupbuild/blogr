import type { LocalState } from "../../domain/LocalState";
import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { getEditableBlog } from "./getEditableBlog";
import { nextBlogUpdatedAt } from "./nextBlogUpdatedAt";
export const updateBlogImages = (state: LocalState, args: Record<string, unknown>, single: boolean) => {
  const blog = getEditableBlog(state, args);
  if (args.expectedBlogUpdatedAt !== undefined && args.expectedBlogUpdatedAt !== blog.updatedAt) throw new Error("This article changed on another tab. Reload before saving image edits.");
  if (args.images !== undefined) blog.images = args.images as BlogItem["images"];
  if (args.mdx !== undefined) blog.mdx = String(args.mdx);
  if (args.featureImageUrl !== undefined) blog.featureImageUrl = String(args.featureImageUrl);
  if (single && args.image) {
    const index = Number(args.imageIndex);
    if (Number.isInteger(index) && index >= 0 && index < blog.images.length) blog.images[index] = args.image as BlogItem["images"][number];
    else blog.images.push(args.image as BlogItem["images"][number]);
  }
  blog.updatedAt = nextBlogUpdatedAt(state);
  return { blogId: blog.id, updatedAt: blog.updatedAt };
};
