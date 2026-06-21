import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

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

    if (args.productId && topic.productId !== args.productId) {
      throw new Error("Topic not found in this workspace.");
    }

    await ctx.db.delete(args.topicId);
  },
});
