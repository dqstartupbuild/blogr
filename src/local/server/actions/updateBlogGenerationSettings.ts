import type { LocalState, LocalProduct } from "../../domain/LocalState";
import { getEditableProduct } from "./getEditableProduct";
export const updateBlogGenerationSettings = (state: LocalState, args: Record<string, unknown>) => {
  const product = getEditableProduct(state, args);
  if (args.expectedProductUpdatedAt !== product.updatedAt) throw new Error("These settings changed on another tab. Reload before saving your edits.");
  product.blogGenerationSettings = args.settings as LocalProduct["blogGenerationSettings"];
  product.updatedAt = Math.max(Date.now(), product.updatedAt + 1);
  return product.id;
};
