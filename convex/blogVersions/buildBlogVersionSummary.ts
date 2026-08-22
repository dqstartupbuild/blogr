import type { Id } from "../_generated/dataModel";

type BuildBlogVersionSummaryOptions = {
  archivedAt: number;
  blogId: Id<"blogs">;
  blogUpdatedAt: number;
  productId?: Id<"products">;
  status: "draft" | "ready" | "failed" | "published";
  title: string;
  userId: string;
  versionId: Id<"blogVersions">;
  versionNumber: number;
};

export const buildBlogVersionSummary = (
  options: BuildBlogVersionSummaryOptions,
) => options;
