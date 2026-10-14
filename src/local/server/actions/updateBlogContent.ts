import type { LocalState } from "../../domain/LocalState";
import { getEditableBlog } from "./getEditableBlog";
import { nextBlogUpdatedAt } from "./nextBlogUpdatedAt";
export const updateBlogContent = (state: LocalState, args: Record<string, unknown>) => {
  const blog = getEditableBlog(state, args);
  if (args.expectedBlogUpdatedAt !== blog.updatedAt) throw new Error("This article changed on another tab. Reload it before saving your draft.");
  for (const key of ["title", "seoTitle", "excerpt", "mdx"] as const) if (args[key] !== undefined) blog[key] = String(args[key]);
  blog.updatedAt = nextBlogUpdatedAt(state);
  return blog.id;
};
