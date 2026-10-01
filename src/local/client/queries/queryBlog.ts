import type { LocalState } from "../../domain/LocalState";
export const queryBlog = (state: LocalState, _name: string, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  const blog = state.blogs.find((item) => item.id === args.blogId && item.productId === productId);
  return blog ? { ...blog, _id: blog.id } : null;
};
