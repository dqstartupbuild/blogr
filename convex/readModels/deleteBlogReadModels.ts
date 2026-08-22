import { applyWorkspaceStatDelta } from "./applyWorkspaceStatDelta";
import { findBlogKeywordOptionByBlogId } from "./findBlogKeywordOptionByBlogId";
import { findBlogSummaryByBlogId } from "./findBlogSummaryByBlogId";
import type { BlogReadModelSource } from "./BlogReadModelSource";
import type { MutationCtx } from "../_generated/server";

export const deleteBlogReadModels = async (
  ctx: MutationCtx,
  blog: BlogReadModelSource,
) => {
  const existingSummary = await findBlogSummaryByBlogId(ctx, blog._id);
  const existingOption = await findBlogKeywordOptionByBlogId(ctx, blog._id);

  if (existingSummary) {
    await applyWorkspaceStatDelta(ctx, {
      blogCount: -1,
      imageCount: -existingSummary.imageCount,
      productId: existingSummary.productId,
      publishedBlogCount: existingSummary.isPublished ? -1 : 0,
      updatedAt: Date.now(),
      userId: existingSummary.userId,
    });
    await ctx.db.delete(existingSummary._id);
  }

  if (existingOption) {
    await ctx.db.delete(existingOption._id);
  }
};
