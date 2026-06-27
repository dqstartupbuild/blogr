import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";

export const listBlogTopicKeywords = query({
  args: {
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);
    let blogsQuery = ctx.db
      .query("blogs")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc");
    const keywords = new Set<string>();

    if (productId) {
      blogsQuery = blogsQuery.filter((q) =>
        q.or(
          q.eq(q.field("productId"), productId),
          q.eq(q.field("productId"), undefined),
        ),
      );
    }

    for await (const blog of blogsQuery) {
      const keyword = blog.keyword.trim();

      if (keyword) {
        keywords.add(keyword);
      }

      if (keywords.size >= 100) {
        break;
      }
    }

    return Array.from(keywords).sort((left, right) =>
      left.localeCompare(right),
    );
  },
});
