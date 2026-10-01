import type { LocalState } from "../../domain/LocalState";
export const getEditableBlog = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  if (!state.products.some((item) => item.id === productId)) throw new Error("Workspace not found.");
  const blog = state.blogs.find((item) => item.id === args.blogId && item.productId === productId);
  if (!blog) throw new Error("Article not found in this workspace.");
  return blog;
};
