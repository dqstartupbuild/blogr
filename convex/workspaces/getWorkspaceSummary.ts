import { v } from "convex/values";
import { query } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { countBlogImageUrls } from "../blogs/countBlogImageUrls";
import { refreshBlogImageUrls } from "../blogs/refreshBlogImageUrls";

export const getWorkspaceSummary = query({
  args: {
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);
    let topicsQuery = ctx.db
      .query("topics")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc");
    let blogsQuery = ctx.db
      .query("blogs")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc");

    if (productId) {
      topicsQuery = topicsQuery.filter((q) =>
        q.or(
          q.eq(q.field("productId"), productId),
          q.eq(q.field("productId"), undefined),
        ),
      );
      blogsQuery = blogsQuery.filter((q) =>
        q.or(
          q.eq(q.field("productId"), productId),
          q.eq(q.field("productId"), undefined),
        ),
      );
    }

    let topicCount = 0;
    let blogCount = 0;
    let imageCount = 0;
    let publishedBlogCount = 0;
    const recentBlogs: Doc<"blogs">[] = [];

    for await (const topic of topicsQuery) {
      if (topic._id) {
        topicCount += 1;
      }
    }

    for await (const blog of blogsQuery) {
      blogCount += 1;
      imageCount += countBlogImageUrls(blog);

      if (blog.status === "published") {
        publishedBlogCount += 1;
      }

      if (recentBlogs.length < 5) {
        recentBlogs.push(blog);
      }
    }

    return {
      blogCount,
      imageCount,
      publishedBlogCount,
      recentBlogs: await Promise.all(recentBlogs.map(refreshBlogImageUrls)),
      topicCount,
    };
  },
});
