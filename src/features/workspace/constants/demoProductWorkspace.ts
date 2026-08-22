import { demoProduct } from "./demoProduct";
import type { ProductWorkspace } from "../types/ProductWorkspace";

export const demoProductWorkspace: ProductWorkspace = {
  id: "demo-workspace",
  name: demoProduct.name,
  niche: demoProduct.niche,
  updatedAt: 0,
  websiteUrl: demoProduct.websiteUrl,
};
