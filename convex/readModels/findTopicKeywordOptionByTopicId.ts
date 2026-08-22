import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const findTopicKeywordOptionByTopicId = async (
  ctx: MutationCtx | QueryCtx,
  topicId: Id<"topics">,
) => {
  return await ctx.db
    .query("topicKeywordOptions")
    .withIndex("by_topicId", (q) => q.eq("topicId", topicId))
    .first();
};
