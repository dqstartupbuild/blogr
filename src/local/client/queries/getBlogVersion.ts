import type { LocalState } from "../../domain/LocalState";
export const getBlogVersion = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  const version = state.blogVersions.find((item) => item.id === args.versionId && item.blogId === args.blogId && item.productId === productId);
  return version ? { ...version, blogCreatedAt: version.createdAt, blogUpdatedAt: version.updatedAt } : null;
};
