import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { topicStatusValidator } from "./topicStatusValidator";

export const listTopics = query({
  args: {
    paginationOpts: paginationOptsValidator,
    productId: v.optional(v.id("products")),
    searchQuery: v.optional(v.string()),
    status: v.optional(topicStatusValidator),
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

    if (args.status === "scheduled") {
      topicsQuery = topicsQuery.filter((q) =>
        q.or(
          q.eq(q.field("status"), "scheduled"),
          q.neq(q.field("scheduledDate"), undefined),
        ),
      );
    } else if (args.status === "saved") {
      topicsQuery = topicsQuery.filter((q) =>
        q.and(
          q.eq(q.field("status"), "saved"),
          q.eq(q.field("scheduledDate"), undefined),
        ),
      );
    } else if (args.status) {
      topicsQuery = topicsQuery.filter((q) =>
        q.eq(q.field("status"), args.status),
      );
    }

    return await topicsQuery.paginate(args.paginationOpts);
  },
});
