import type { Id } from "../../../convex/_generated/dataModel";

export const castBlogId = (blogId: string) => {
  return blogId as Id<"blogs">;
};
