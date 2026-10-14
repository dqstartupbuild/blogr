import type { LocalState } from "../../domain/LocalState";
export const listBlogVersions = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  return state.blogVersions.filter((item) => item.blogId === args.blogId && item.productId === productId).sort((a, b) => b.versionNumber - a.versionNumber).map((item) => ({ id: item.id, archivedAt: item.archivedAt, versionNumber: item.versionNumber, title: item.title, status: item.status, updatedAt: item.updatedAt }));
};
