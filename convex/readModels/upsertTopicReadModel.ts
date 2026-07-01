import { applyWorkspaceStatDelta } from "./applyWorkspaceStatDelta";
import { buildTopicKeywordOption } from "./buildTopicKeywordOption";
import { findTopicKeywordOptionByTopicId } from "./findTopicKeywordOptionByTopicId";
import type { TopicReadModelSource } from "./TopicReadModelSource";
import type { MutationCtx } from "../_generated/server";

export const upsertTopicReadModel = async (
  ctx: MutationCtx,
  topic: TopicReadModelSource,
) => {
  const option = buildTopicKeywordOption(topic);

  if (!option) {
    return;
  }

  const existing = await findTopicKeywordOptionByTopicId(ctx, topic._id);

  if (!existing) {
    await applyWorkspaceStatDelta(ctx, {
      productId: option.productId,
      topicCount: 1,
      updatedAt: option.updatedAt,
      userId: option.userId,
    });
    await ctx.db.insert("topicKeywordOptions", option);
    return;
  }

  if (existing.productId !== option.productId) {
    await applyWorkspaceStatDelta(ctx, {
      productId: existing.productId,
      topicCount: -1,
      updatedAt: option.updatedAt,
      userId: existing.userId,
    });
    await applyWorkspaceStatDelta(ctx, {
      productId: option.productId,
      topicCount: 1,
      updatedAt: option.updatedAt,
      userId: option.userId,
    });
  }

  await ctx.db.patch(existing._id, option);
};
