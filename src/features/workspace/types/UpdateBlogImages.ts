import type { BlogImageChanges } from "./BlogImageChanges";

export type UpdateBlogImages = (
  blogId: string,
  changes: BlogImageChanges,
) => Promise<void>;
