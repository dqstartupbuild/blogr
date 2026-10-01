import type { LocalState } from "../../domain/LocalState";
export const getProductWorkspaces = (state: LocalState) => ({ activeProductId: state.activeProductId || undefined, products: state.products.map((item) => ({ ...item, _id: item.id })) });
