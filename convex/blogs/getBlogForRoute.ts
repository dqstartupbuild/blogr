import { v } from "convex/values";
import { query } from "../_generated/server";

export const getBlogForRoute = query({
  args: {
    blogId: v.id("blogs"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== args.userId) {
      return null;
    }

    return blog;
  },
});
