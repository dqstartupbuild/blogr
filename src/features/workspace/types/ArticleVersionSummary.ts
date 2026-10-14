import type { BlogStatus } from "./BlogStatus";

export type ArticleVersionSummary = {
  archivedAt: number;
  id: string;
  status: BlogStatus;
  title: string;
  updatedAt: number;
  versionNumber: number;
};
