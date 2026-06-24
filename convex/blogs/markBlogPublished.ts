import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const markBlogPublished = mutation({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== userId) {
      throw new Error("Blog not found.");
    }

    if (args.productId && blog.productId && blog.productId !== args.productId) {
      throw new Error("Blog not found in this workspace.");
    }

    await ctx.db.patch(args.blogId, {
      productId: blog.productId || args.productId,
      status: "published",
      updatedAt: Date.now(),
    });
  },
});
