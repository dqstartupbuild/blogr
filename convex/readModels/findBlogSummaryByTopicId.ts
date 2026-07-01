import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const findBlogSummaryByTopicId = async (
  ctx: MutationCtx | QueryCtx,
  topicId: Id<"topics">,
) => {
  return await ctx.db
    .query("blogSummaries")
    .withIndex("by_topicId", (q) => q.eq("topicId", topicId))
    .first();
};
