import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const deleteTopic = mutation({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const topic = await ctx.db.get(args.topicId);

    if (!topic || topic.userId !== userId) {
      throw new Error("Topic not found.");
    }

    await ctx.db.delete(args.topicId);
  },
});
