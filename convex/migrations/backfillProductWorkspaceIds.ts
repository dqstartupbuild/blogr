import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { createImportedProductWorkspace } from "../products/createImportedProductWorkspace";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { saveWorkspaceSelection } from "../workspaceSelections/saveWorkspaceSelection";

export const backfillProductWorkspaceIds = mutation({
  args: {
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    let productId: Id<"products"> | null = await resolveActiveProductId(
      ctx,
      userId,
      args.productId,
    );

    if (!productId) {
      productId = await createImportedProductWorkspace(ctx, userId);
    }

    const topics = await ctx.db
      .query("topics")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .collect();
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    const legacyTopics = topics.filter((topic) => !topic.productId);
    const legacyBlogs = blogs.filter((blog) => !blog.productId);

    for (const topic of legacyTopics) {
      await ctx.db.patch(topic._id, { productId });
    }

    for (const blog of legacyBlogs) {
      await ctx.db.patch(blog._id, { productId });
    }

    await saveWorkspaceSelection(ctx, userId, productId);

    return {
      productId,
      topicsUpdated: legacyTopics.length,
      blogsUpdated: legacyBlogs.length,
    };
  },
});
