import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const findBlogKeywordOptionByBlogId = async (
  ctx: MutationCtx | QueryCtx,
  blogId: Id<"blogs">,
) => {
  return await ctx.db
    .query("blogKeywordOptions")
    .withIndex("by_blogId", (q) => q.eq("blogId", blogId))
    .first();
};
