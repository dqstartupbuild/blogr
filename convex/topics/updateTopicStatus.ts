import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { topicStatusValidator } from "./topicStatusValidator";

export const updateTopicStatus = mutation({
  args: {
    topicId: v.id("topics"),
    productId: v.optional(v.id("products")),
    status: topicStatusValidator,
    blogId: v.optional(v.id("blogs")),
    lastError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const topic = await ctx.db.get(args.topicId);

    if (!topic || topic.userId !== userId) {
      throw new Error("Topic not found.");
    }

    if (args.productId && topic.productId && topic.productId !== args.productId) {
      throw new Error("Topic not found in this workspace.");
    }

    const updatedTopic = {
      ...topic,
      productId: topic.productId || args.productId,
      status: args.status,
      blogId: args.blogId,
      lastError: args.lastError,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.topicId, {
      productId: updatedTopic.productId,
      status: updatedTopic.status,
      blogId: updatedTopic.blogId,
      lastError: updatedTopic.lastError,
      updatedAt: updatedTopic.updatedAt,
    });
    await upsertTopicReadModel(ctx, updatedTopic);
  },
});
