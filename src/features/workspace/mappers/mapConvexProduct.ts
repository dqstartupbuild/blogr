import { demoProduct } from "../constants/demoProduct";
import type { ProductProfile } from "../types/ProductProfile";

type ConvexProductLike = Partial<ProductProfile> | null | undefined;

export const mapConvexProduct = (
  product: ConvexProductLike,
): ProductProfile => {
  return {
    ...demoProduct,
    ...(product || {}),
    colors: product?.colors || demoProduct.colors,
    siteLinks: product?.siteLinks || demoProduct.siteLinks,
  };
};
