import type { BlogItem } from "./BlogItem";

export type ArticleVersionItem = BlogItem & {
  archivedAt: number;
  versionNumber: number;
};
