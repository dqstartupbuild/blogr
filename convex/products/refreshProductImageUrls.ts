import type { Doc } from "../_generated/dataModel";
import { getR2ImageUrls } from "../r2/getR2ImageUrls";

export const refreshProductImageUrls = async (product: Doc<"products">) => {
  const [assets, productImages] = await Promise.all([
    getR2ImageUrls({
      fallbackUrls: product.assets,
      keys: product.assetKeys,
    }),
    getR2ImageUrls({
      fallbackUrls: product.productImages,
      keys: product.productImageKeys,
    }),
  ]);

  return {
    ...product,
    assets,
    productImages,
  };
};
