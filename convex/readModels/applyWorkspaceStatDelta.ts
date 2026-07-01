import { findWorkspaceStats } from "./findWorkspaceStats";
import type { WorkspaceStatDelta } from "./WorkspaceStatDelta";
import type { MutationCtx } from "../_generated/server";

const addStat = (current: number, delta = 0) => {
  return Math.max(0, current + delta);
};

export const applyWorkspaceStatDelta = async (
  ctx: MutationCtx,
  delta: WorkspaceStatDelta,
) => {
  const topicDelta = delta.topicCount || 0;
  const blogDelta = delta.blogCount || 0;
  const publishedDelta = delta.publishedBlogCount || 0;
  const imageDelta = delta.imageCount || 0;

  if (!topicDelta && !blogDelta && !publishedDelta && !imageDelta) {
    return;
  }

  const existing = await findWorkspaceStats(ctx, delta.userId, delta.productId);

  if (!existing) {
    await ctx.db.insert("workspaceStats", {
      blogCount: Math.max(0, blogDelta),
      imageCount: Math.max(0, imageDelta),
      productId: delta.productId,
      publishedBlogCount: Math.max(0, publishedDelta),
      topicCount: Math.max(0, topicDelta),
      updatedAt: delta.updatedAt,
      userId: delta.userId,
    });
    return;
  }

  await ctx.db.patch(existing._id, {
    blogCount: addStat(existing.blogCount, blogDelta),
    imageCount: addStat(existing.imageCount, imageDelta),
    publishedBlogCount: addStat(
      existing.publishedBlogCount,
      publishedDelta,
    ),
    topicCount: addStat(existing.topicCount, topicDelta),
    updatedAt: delta.updatedAt,
  });
};
