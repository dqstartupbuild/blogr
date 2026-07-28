import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export const deleteBlogVersions = async (
  ctx: MutationCtx,
  blogId: Id<"blogs">,
) => {
  const versions = await ctx.db
    .query("blogVersions")
    .withIndex("by_blogId_versionNumber", (q) => q.eq("blogId", blogId))
    .collect();
  const summaries = await ctx.db
    .query("blogVersionSummaries")
    .withIndex("by_blogId_versionNumber", (q) => q.eq("blogId", blogId))
    .collect();

  await Promise.all([
    ...versions.map((version) => ctx.db.delete(version._id)),
    ...summaries.map((summary) => ctx.db.delete(summary._id)),
  ]);
};
