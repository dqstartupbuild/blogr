import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const listBlogVersions = query({
  args: {
    blogId: v.id("blogs"),
    paginationOpts: paginationOptsValidator,
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== userId) {
      return {
        continueCursor: "",
        isDone: true,
        page: [],
        pageStatus: null,
      };
    }

    if (args.productId && blog.productId && blog.productId !== args.productId) {
      return {
        continueCursor: "",
        isDone: true,
        page: [],
        pageStatus: null,
      };
    }

    const result = await ctx.db
      .query("blogVersionSummaries")
      .withIndex("by_userId_blogId_versionNumber", (q) =>
        q.eq("userId", userId).eq("blogId", args.blogId),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map((version) => ({
        archivedAt: version.archivedAt,
        id: version.versionId,
        status: version.status,
        title: version.title,
        updatedAt: version.blogUpdatedAt,
        versionNumber: version.versionNumber,
      })),
    };
  },
});
