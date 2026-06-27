import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";

export const listTopics = query({
  args: {
    paginationOpts: paginationOptsValidator,
    productId: v.optional(v.id("products")),
    searchQuery: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("saved"),
        v.literal("writing"),
        v.literal("written"),
        v.literal("failed"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);
    const searchQuery = args.searchQuery?.trim();

    let topicsQuery = searchQuery
      ? ctx.db
          .query("topics")
          .withSearchIndex("search_user_topics", (q) =>
            q.search("searchText", searchQuery).eq("userId", userId),
          )
      : ctx.db
          .query("topics")
          .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
          .order("desc");

    if (productId) {
      topicsQuery = topicsQuery.filter((q) =>
        q.or(
          q.eq(q.field("productId"), productId),
          q.eq(q.field("productId"), undefined),
        ),
      );
    }

    if (args.status) {
      topicsQuery = topicsQuery.filter((q) =>
        q.eq(q.field("status"), args.status),
      );
    }

    return await topicsQuery.paginate(args.paginationOpts);
  },
});
