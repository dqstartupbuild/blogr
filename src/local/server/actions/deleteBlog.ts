import type { LocalState } from "../../domain/LocalState";
import { getEditableBlog } from "./getEditableBlog";
export const deleteBlog = (state: LocalState, args: Record<string, unknown>) => {
  const blog = getEditableBlog(state, args);
  state.blogs = state.blogs.filter((item) => item.id !== blog.id);
  state.blogVersions = state.blogVersions.filter((item) => item.blogId !== blog.id);
  const topic = state.topics.find((item) => item.blogId === blog.id && item.productId === blog.productId);
  if (topic) { topic.blogId = undefined; topic.status = topic.scheduledDate ? "scheduled" : "saved"; topic.updatedAt = Math.max(Date.now(), (topic.updatedAt || 0) + 1); }
  return blog.id;
};
