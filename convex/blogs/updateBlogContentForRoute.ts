import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const updateBlogContentForRoute = mutation({
  args: {
    blogId: v.id("blogs"),
    userId: v.string(),
    title: v.string(),
    excerpt: v.string(),
    mdx: v.string(),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== args.userId) {
      throw new Error("Blog not found.");
    }

    await ctx.db.patch(args.blogId, {
      title: args.title.trim(),
      excerpt: args.excerpt.trim(),
      mdx: args.mdx,
      updatedAt: Date.now(),
    });
  },
});
