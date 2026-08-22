import type { Id } from "../_generated/dataModel";

export type WorkspaceStatDelta = {
  userId: string;
  productId: Id<"products">;
  topicCount?: number;
  blogCount?: number;
  publishedBlogCount?: number;
  imageCount?: number;
  updatedAt: number;
};
