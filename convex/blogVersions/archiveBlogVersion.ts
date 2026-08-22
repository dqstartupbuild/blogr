import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { buildBlogVersionSnapshot } from "./buildBlogVersionSnapshot";
import { buildBlogVersionSummary } from "./buildBlogVersionSummary";

export const archiveBlogVersion = async (
  ctx: MutationCtx,
  blog: Doc<"blogs">,
  archivedAt: number,
) => {
  const latestVersion = await ctx.db
    .query("blogVersions")
    .withIndex("by_blogId_versionNumber", (q) => q.eq("blogId", blog._id))
    .order("desc")
    .first();

  const versionNumber = (latestVersion?.versionNumber || 0) + 1;
  const versionId = await ctx.db.insert(
    "blogVersions",
    buildBlogVersionSnapshot(blog, archivedAt, versionNumber),
  );

  await ctx.db.insert(
    "blogVersionSummaries",
    buildBlogVersionSummary({
      archivedAt,
      blogId: blog._id,
      blogUpdatedAt: blog.updatedAt,
      productId: blog.productId,
      status: blog.status,
      title: blog.title,
      userId: blog.userId,
      versionId,
      versionNumber,
    }),
  );

  return versionId;
};
