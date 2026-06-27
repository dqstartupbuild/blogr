import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { refreshBlogImageUrls } from "./refreshBlogImageUrls";

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

    let blogsQuery = searchQuery
      ? ctx.db
          .query("blogs")
          .withSearchIndex("search_user_blogs", (q) =>
            q.search("searchText", searchQuery).eq("userId", userId),
          )
      : ctx.db
          .query("blogs")
          .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
          .order("desc");

    if (productId) {
      blogsQuery = blogsQuery.filter((q) =>
        q.or(
          q.eq(q.field("productId"), productId),
          q.eq(q.field("productId"), undefined),
        ),
      );
    }

    if (args.status === "published") {
      blogsQuery = blogsQuery.filter((q) =>
        q.eq(q.field("status"), "published"),
      );
    }

    if (args.status === "unpublished") {
      blogsQuery = blogsQuery.filter((q) =>
        q.neq(q.field("status"), "published"),
      );
    }

    if (topicKeyword) {
      blogsQuery = blogsQuery.filter((q) =>
        q.eq(q.field("keyword"), topicKeyword),
      );
    }

    const result = await blogsQuery.paginate(args.paginationOpts);

    return {
      ...result,
      page: await Promise.all(result.page.map(refreshBlogImageUrls)),
    };
  },
});
