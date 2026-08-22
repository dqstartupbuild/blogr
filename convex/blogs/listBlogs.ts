import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";

export const listBlogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
    productId: v.optional(v.id("products")),
    searchQuery: v.optional(v.string()),
    status: v.optional(v.union(v.literal("published"), v.literal("unpublished"))),
    topicKeyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);
    const searchQuery = args.searchQuery?.trim();
    const topicKeyword = args.topicKeyword?.trim();
    const isPublished =
      args.status === "published"
        ? true
        : args.status === "unpublished"
          ? false
          : undefined;

    if (!productId) {
      return {
        continueCursor: "",
        isDone: true,
        page: [],
        pageStatus: null,
      };
    }

    const summariesQuery = searchQuery
      ? ctx.db
          .query("blogSummaries")
          .withSearchIndex("search_product_blog_summaries", (q) => {
            let search = q
              .search("searchText", searchQuery)
              .eq("userId", userId)
              .eq("productId", productId);

            if (typeof isPublished === "boolean") {
              search = search.eq("isPublished", isPublished);
            }

            if (topicKeyword) {
              search = search.eq("keyword", topicKeyword);
            }

            return search;
          })
      : typeof isPublished === "boolean" && topicKeyword
        ? ctx.db
            .query("blogSummaries")
            .withIndex(
              "by_userId_productId_isPublished_keyword_updatedAt",
              (q) =>
                q
                  .eq("userId", userId)
                  .eq("productId", productId)
                  .eq("isPublished", isPublished)
                  .eq("keyword", topicKeyword),
            )
            .order("desc")
        : typeof isPublished === "boolean"
          ? ctx.db
              .query("blogSummaries")
              .withIndex(
                "by_userId_productId_isPublished_updatedAt",
                (q) =>
                  q
                    .eq("userId", userId)
                    .eq("productId", productId)
                    .eq("isPublished", isPublished),
              )
              .order("desc")
          : topicKeyword
            ? ctx.db
                .query("blogSummaries")
                .withIndex("by_userId_productId_keyword_updatedAt", (q) =>
                  q
                    .eq("userId", userId)
                    .eq("productId", productId)
                    .eq("keyword", topicKeyword),
                )
                .order("desc")
            : ctx.db
                .query("blogSummaries")
                .withIndex("by_userId_productId_updatedAt", (q) =>
                  q.eq("userId", userId).eq("productId", productId),
                )
                .order("desc");

    return await summariesQuery.paginate(args.paginationOpts);
  },
});
