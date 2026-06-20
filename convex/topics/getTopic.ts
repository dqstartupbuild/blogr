import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const getTopic = query({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const topic = await ctx.db.get(args.topicId);

    if (!topic || topic.userId !== userId) {
      return null;
    }

    return topic;
  },
});
