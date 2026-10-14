import type { LocalState } from "../../domain/LocalState";
export const nextBlogUpdatedAt = (state: LocalState) => state.blogs.reduce((latest, item) => Math.max(latest, item.updatedAt + 1), Date.now());
