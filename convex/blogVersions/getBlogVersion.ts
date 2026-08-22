import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { refreshBlogVersionImageUrls } from "./refreshBlogVersionImageUrls";

export const getBlogVersion = query({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
    versionId: v.id("blogVersions"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const [blog, version] = await Promise.all([
      ctx.db.get(args.blogId),
      ctx.db.get(args.versionId),
    ]);

    if (
      !blog ||
      !version ||
      blog.userId !== userId ||
      version.userId !== userId ||
      version.blogId !== args.blogId
    ) {
      return null;
    }

    if (
      args.productId &&
      ((blog.productId && blog.productId !== args.productId) ||
        (version.productId && version.productId !== args.productId))
    ) {
      return null;
    }

    return await refreshBlogVersionImageUrls(version);
  },
});
