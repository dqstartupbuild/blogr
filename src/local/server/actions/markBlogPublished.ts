import type { LocalState } from "../../domain/LocalState";
import { getEditableBlog } from "./getEditableBlog";
import { nextBlogUpdatedAt } from "./nextBlogUpdatedAt";
export const markBlogPublished = (state: LocalState, args: Record<string, unknown>) => {
  const blog = getEditableBlog(state, args);
  blog.status = "published";
  blog.publishedAt ||= Date.now();
  blog.updatedAt = nextBlogUpdatedAt(state);
  const topic = state.topics.find((item) => item.blogId === blog.id && item.productId === blog.productId);
  if (topic) { topic.status = "published"; topic.updatedAt = Math.max(Date.now(), (topic.updatedAt || 0) + 1); }
  return blog.id;
};
