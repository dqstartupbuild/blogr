import type { LocalState } from "../../domain/LocalState";
export const deleteProductWorkspace = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || "");
  if (!state.products.some((item) => item.id === productId)) throw new Error("Workspace not found.");
  const blogIds = new Set(state.blogs.filter((item) => item.productId === productId).map((item) => item.id));
  state.products = state.products.filter((item) => item.id !== productId);
  state.topics = state.topics.filter((item) => item.productId !== productId);
  state.blogs = state.blogs.filter((item) => item.productId !== productId);
  state.blogVersions = state.blogVersions.filter((item) => !blogIds.has(item.blogId));
  if (state.activeProductId === productId) state.activeProductId = state.products[0]?.id || null;
  return productId;
};
