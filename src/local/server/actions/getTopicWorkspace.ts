import type { LocalState } from "../../domain/LocalState";
export const getTopicWorkspace = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  if (!state.products.some((item) => item.id === productId)) throw new Error("Workspace not found.");
  return productId;
};
