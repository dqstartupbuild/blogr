import type { LocalState } from "../../domain/LocalState";
export const listBlogTopicKeywords = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  return [...new Set(state.blogs.filter((item) => item.productId === productId).map((item) => item.keyword))].sort();
};
