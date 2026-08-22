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
    const status = args.status;

    if (!productId) {
      return {
        continueCursor: "",
        isDone: true,
        page: [],
        pageStatus: null,
      };
    }

    const topicsQuery = searchQuery
      ? ctx.db
          .query("topicKeywordOptions")
          .withSearchIndex("search_product_topic_options", (q) => {
            let search = q
              .search("searchText", searchQuery)
              .eq("userId", userId)
              .eq("productId", productId);

            if (status === "scheduled") {
              search = search.eq("isScheduled", true);
            } else if (status === "saved") {
              search = search.eq("status", "saved").eq("isScheduled", false);
            } else if (status) {
              search = search.eq("status", status);
            }

            return search;
          })
      : status === "scheduled"
        ? ctx.db
            .query("topicKeywordOptions")
            .withIndex("by_userId_productId_isScheduled_updatedAt", (q) =>
              q
                .eq("userId", userId)
                .eq("productId", productId)
                .eq("isScheduled", true),
            )
            .order("desc")
        : status === "saved"
          ? ctx.db
              .query("topicKeywordOptions")
              .withIndex(
                "by_userId_productId_status_isScheduled_updatedAt",
                (q) =>
                  q
                    .eq("userId", userId)
                    .eq("productId", productId)
                    .eq("status", "saved")
                    .eq("isScheduled", false),
              )
              .order("desc")
          : status
            ? ctx.db
                .query("topicKeywordOptions")
                .withIndex("by_userId_productId_status_updatedAt", (q) =>
                  q
                    .eq("userId", userId)
                    .eq("productId", productId)
                    .eq("status", status),
                )
                .order("desc")
            : ctx.db
                .query("topicKeywordOptions")
                .withIndex("by_userId_productId_updatedAt", (q) =>
                  q.eq("userId", userId).eq("productId", productId),
                )
                .order("desc");
    const result = await topicsQuery.paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map((topic) => ({
        ...topic,
        _id: topic.topicId,
      })),
    };
  },
});
