import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { deleteTopicReadModel } from "../readModels/deleteTopicReadModel";

export const deleteTopic = mutation({
  args: {
    topicId: v.id("topics"),
    productId: v.optional(v.id("products")),
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

    if (topic.blogId) {
      const blog = await ctx.db.get(topic.blogId);

      if (blog?.userId === userId && blog.topicId === args.topicId) {
        await ctx.db.patch(topic.blogId, {
          topicId: undefined,
          updatedAt: Date.now(),
        });
      }
    }

    await deleteTopicReadModel(ctx, topic);
    await ctx.db.delete(args.topicId);
  },
});
