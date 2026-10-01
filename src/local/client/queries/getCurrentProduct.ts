import type { LocalState } from "../../domain/LocalState";
export const getCurrentProduct = (state: LocalState, args: Record<string, unknown>) => state.products.find((item) => item.id === String(args.productId || state.activeProductId || "")) || null;
