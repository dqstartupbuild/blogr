import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";

export const getWorkspaceSummary = query({
  args: {
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);

    if (!productId) {
      return {
        blogCount: 0,
        imageCount: 0,
        publishedBlogCount: 0,
        recentBlogs: [],
        topicCount: 0,
      };
    }

    const [stats, recentBlogs] = await Promise.all([
      ctx.db
        .query("workspaceStats")
        .withIndex("by_userId_productId", (q) =>
          q.eq("userId", userId).eq("productId", productId),
        )
        .first(),
      ctx.db
        .query("blogSummaries")
        .withIndex("by_userId_productId_updatedAt", (q) =>
          q.eq("userId", userId).eq("productId", productId),
        )
        .order("desc")
        .take(5),
    ]);

    return {
      blogCount: stats?.blogCount || 0,
      imageCount: stats?.imageCount || 0,
      publishedBlogCount: stats?.publishedBlogCount || 0,
      recentBlogs,
      topicCount: stats?.topicCount || 0,
    };
  },
});
