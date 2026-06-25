import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const deleteBlog = mutation({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== userId) {
      throw new Error("Article not found.");
    }

    if (args.productId && blog.productId && blog.productId !== args.productId) {
      throw new Error("Article not found in this workspace.");
    }

    if (blog.topicId) {
      const topic = await ctx.db.get(blog.topicId);

      if (topic?.userId === userId && topic.blogId === args.blogId) {
        await ctx.db.patch(blog.topicId, {
          blogId: undefined,
          status: "saved",
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.delete(args.blogId);
  },
});
