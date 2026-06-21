import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { refreshBlogImageUrls } from "./refreshBlogImageUrls";

export const listBlogs = query({
  args: {
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);

    if (!productId) {
      const blogs = await ctx.db
        .query("blogs")
        .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
        .order("desc")
        .collect();

      return await Promise.all(blogs.map(refreshBlogImageUrls));
    }

    const scopedBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .order("desc")
      .collect();
    const legacyBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const blogs = [...scopedBlogs, ...legacyBlogs.filter((blog) => !blog.productId)]
      .sort((left, right) => right.updatedAt - left.updatedAt);

    return await Promise.all(blogs.map(refreshBlogImageUrls));
  },
});
