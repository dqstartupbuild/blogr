import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const updateTopicStatus = mutation({
  args: {
    topicId: v.id("topics"),
    productId: v.optional(v.id("products")),
    status: v.union(
      v.literal("saved"),
      v.literal("writing"),
      v.literal("written"),
      v.literal("failed"),
    ),
    blogId: v.optional(v.id("blogs")),
    lastError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const topic = await ctx.db.get(args.topicId);

    if (!topic || topic.userId !== userId) {
      throw new Error("Topic not found.");
    }

    if (args.productId && topic.productId !== args.productId) {
      throw new Error("Topic not found in this workspace.");
    }

    await ctx.db.patch(args.topicId, {
      status: args.status,
      blogId: args.blogId,
      lastError: args.lastError,
      updatedAt: Date.now(),
    });
  },
});
