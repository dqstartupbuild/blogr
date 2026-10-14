import type { LocalState } from "../../domain/LocalState";
export const setActiveProductWorkspace = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || "");
  if (!state.products.some((item) => item.id === productId)) throw new Error("Workspace not found.");
  state.activeProductId = productId;
  return productId;
};
