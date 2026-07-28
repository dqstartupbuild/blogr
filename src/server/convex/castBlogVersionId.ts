import type { Id } from "../../../convex/_generated/dataModel";

export const castBlogVersionId = (value: string) =>
  value as Id<"blogVersions">;
