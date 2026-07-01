import { applyWorkspaceStatDelta } from "./applyWorkspaceStatDelta";
import { buildBlogKeywordOption } from "./buildBlogKeywordOption";
import { buildBlogSummary } from "./buildBlogSummary";
import { findBlogKeywordOptionByBlogId } from "./findBlogKeywordOptionByBlogId";
import { findBlogSummaryByBlogId } from "./findBlogSummaryByBlogId";
import type { BlogReadModelSource } from "./BlogReadModelSource";
import type { MutationCtx } from "../_generated/server";

export const upsertBlogReadModels = async (
  ctx: MutationCtx,
  blog: BlogReadModelSource,
) => {
  const summary = buildBlogSummary(blog);
  const option = buildBlogKeywordOption(blog);

  if (!summary || !option) {
    return;
  }

  const existingSummary = await findBlogSummaryByBlogId(ctx, blog._id);
  const existingOption = await findBlogKeywordOptionByBlogId(ctx, blog._id);

  if (!existingSummary) {
    await applyWorkspaceStatDelta(ctx, {
      blogCount: 1,
      imageCount: summary.imageCount,
      productId: summary.productId,
      publishedBlogCount: summary.isPublished ? 1 : 0,
      updatedAt: summary.updatedAt,
      userId: summary.userId,
    });
    await ctx.db.insert("blogSummaries", summary);
  } else {
    if (existingSummary.productId !== summary.productId) {
      await applyWorkspaceStatDelta(ctx, {
        blogCount: -1,
        imageCount: -existingSummary.imageCount,
        productId: existingSummary.productId,
        publishedBlogCount: existingSummary.isPublished ? -1 : 0,
        updatedAt: summary.updatedAt,
        userId: existingSummary.userId,
      });
      await applyWorkspaceStatDelta(ctx, {
        blogCount: 1,
        imageCount: summary.imageCount,
        productId: summary.productId,
        publishedBlogCount: summary.isPublished ? 1 : 0,
        updatedAt: summary.updatedAt,
        userId: summary.userId,
      });
    } else {
      await applyWorkspaceStatDelta(ctx, {
        imageCount: summary.imageCount - existingSummary.imageCount,
        productId: summary.productId,
        publishedBlogCount:
          Number(summary.isPublished) - Number(existingSummary.isPublished),
        updatedAt: summary.updatedAt,
        userId: summary.userId,
      });
    }

    await ctx.db.patch(existingSummary._id, summary);
  }

  if (existingOption) {
    await ctx.db.patch(existingOption._id, option);
    return;
  }

  await ctx.db.insert("blogKeywordOptions", option);
};
