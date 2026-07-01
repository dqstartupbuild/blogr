import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { findProductWorkspaceSummary } from "./findProductWorkspaceSummary";
import { findWorkspaceStats } from "./findWorkspaceStats";
import { upsertBlogReadModels } from "./upsertBlogReadModels";
import { upsertProductProfile } from "./upsertProductProfile";
import { upsertProductWorkspaceSummary } from "./upsertProductWorkspaceSummary";
import { upsertTopicReadModel } from "./upsertTopicReadModel";

export const ensureWorkspaceReadModels = mutation({
  args: {
    force: v.optional(v.boolean()),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);

    if (!productId) {
      return { blogCount: 0, rebuilt: false, topicCount: 0 };
    }

    const product = await ctx.db.get(productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    const [
      existingStats,
      existingProductSummary,
      existingBlogSummary,
      existingTopicOption,
    ] = await Promise.all([
      findWorkspaceStats(ctx, userId, productId),
      findProductWorkspaceSummary(ctx, productId),
      ctx.db
        .query("blogSummaries")
        .withIndex("by_userId_productId_updatedAt", (q) =>
          q.eq("userId", userId).eq("productId", productId),
        )
        .first(),
      ctx.db
        .query("topicKeywordOptions")
        .withIndex("by_userId_productId_updatedAt", (q) =>
          q.eq("userId", userId).eq("productId", productId),
        )
        .first(),
    ]);

    if (
      !args.force &&
      existingStats &&
      existingProductSummary &&
      (existingStats.blogCount === 0 || existingBlogSummary) &&
      (existingStats.topicCount === 0 || existingTopicOption)
    ) {
      return {
        blogCount: existingStats.blogCount,
        rebuilt: false,
        topicCount: existingStats.topicCount,
      };
    }

    const existingBlogSummaries = await ctx.db
      .query("blogSummaries")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .collect();
    const existingBlogOptions = await ctx.db
      .query("blogKeywordOptions")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .collect();
    const existingTopicOptions = await ctx.db
      .query("topicKeywordOptions")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .collect();

    for (const summary of existingBlogSummaries) {
      await ctx.db.delete(summary._id);
    }

    for (const option of existingBlogOptions) {
      await ctx.db.delete(option._id);
    }

    for (const option of existingTopicOptions) {
      await ctx.db.delete(option._id);
    }

    if (existingStats) {
      await ctx.db.delete(existingStats._id);
    }

    await upsertProductWorkspaceSummary(ctx, product);
    await upsertProductProfile(ctx, product);

    const topics = await ctx.db
      .query("topics")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .collect();
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    let topicCount = 0;
    let blogCount = 0;

    for (const topic of topics) {
      if (topic.productId && topic.productId !== productId) {
        continue;
      }

      const topicProductId = topic.productId || productId;

      if (!topic.productId) {
        await ctx.db.patch(topic._id, { productId: topicProductId });
      }

      await upsertTopicReadModel(ctx, {
        ...topic,
        productId: topicProductId,
      });
      topicCount += 1;
    }

    for (const blog of blogs) {
      if (blog.productId && blog.productId !== productId) {
        continue;
      }

      const blogProductId = blog.productId || productId;

      if (!blog.productId) {
        await ctx.db.patch(blog._id, { productId: blogProductId });
      }

      await upsertBlogReadModels(ctx, {
        ...blog,
        productId: blogProductId,
      });
      blogCount += 1;
    }

    return { blogCount, rebuilt: true, topicCount };
  },
});
