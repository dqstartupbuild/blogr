import { applyWorkspaceStatDelta } from "./applyWorkspaceStatDelta";
import { findTopicKeywordOptionByTopicId } from "./findTopicKeywordOptionByTopicId";
import type { TopicReadModelSource } from "./TopicReadModelSource";
import type { MutationCtx } from "../_generated/server";

export const deleteTopicReadModel = async (
  ctx: MutationCtx,
  topic: TopicReadModelSource,
) => {
  const existing = await findTopicKeywordOptionByTopicId(ctx, topic._id);

  if (!existing) {
    return;
  }

  await applyWorkspaceStatDelta(ctx, {
    productId: existing.productId,
    topicCount: -1,
    updatedAt: Date.now(),
    userId: existing.userId,
  });
  await ctx.db.delete(existing._id);
};
