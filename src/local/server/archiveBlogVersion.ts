import { randomUUID } from "node:crypto";
import type { LocalState } from "../domain/LocalState";
import type { BlogItem } from "@/features/workspace/types/BlogItem";

export const archiveBlogVersion = (state: LocalState, blog: BlogItem): void => {
  const versionNumber = 1 + Math.max(0, ...state.blogVersions.filter((item) => item.blogId === blog.id).map((item) => item.versionNumber));
  state.blogVersions.push({ ...structuredClone(blog), id: randomUUID(), blogId: blog.id, archivedAt: Date.now(), versionNumber });
};
