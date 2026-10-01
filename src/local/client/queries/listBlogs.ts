import type { LocalState } from "../../domain/LocalState";
import { paginateLocal } from "./paginateLocal";
import { summarizeBlog } from "./summarizeBlog";
export const listBlogs = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  const search = String(args.searchQuery || "").toLowerCase();
  const items = state.blogs.filter((item) => item.productId === productId && (!args.status || (args.status === "published" ? item.status === "published" : item.status !== "published")) && (!args.topicKeyword || item.keyword === args.topicKeyword) && (!search || `${item.title} ${item.keyword} ${item.excerpt}`.toLowerCase().includes(search)));
  return paginateLocal(items.sort((a, b) => b.updatedAt - a.updatedAt).map(summarizeBlog), args);
};
