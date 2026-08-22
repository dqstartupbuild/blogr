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
    const keywords = new Set<string>();

    if (!productId) {
      return [];
    }

    const optionsQuery = ctx.db
      .query("blogKeywordOptions")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .order("desc");

    for await (const option of optionsQuery) {
      const keyword = option.keyword.trim();

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
