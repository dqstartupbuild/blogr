import type { LocalState } from "../../domain/LocalState";
import { summarizeBlog } from "./summarizeBlog";
export const getWorkspaceSummary = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  const blogs = state.blogs.filter((item) => item.productId === productId);
  return { blogCount: blogs.length, imageCount: blogs.reduce((sum, item) => sum + item.images.length, 0), publishedBlogCount: blogs.filter((item) => item.status === "published").length, recentBlogs: [...blogs].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5).map(summarizeBlog), topicCount: state.topics.filter((item) => item.productId === productId).length };
};
