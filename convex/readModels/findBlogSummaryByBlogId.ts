import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const findBlogSummaryByBlogId = async (
  ctx: MutationCtx | QueryCtx,
  blogId: Id<"blogs">,
) => {
  return await ctx.db
    .query("blogSummaries")
    .withIndex("by_blogId", (q) => q.eq("blogId", blogId))
    .first();
};
