import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const getBlog = query({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== userId) {
      return null;
    }

    if (args.productId && blog.productId !== args.productId) {
      return null;
    }

    return blog;
  },
});
