import type { LocalState } from "../../domain/LocalState";
export const getEditableProduct = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  const product = state.products.find((item) => item.id === productId);
  if (!product) throw new Error("Workspace not found.");
  return product;
};
