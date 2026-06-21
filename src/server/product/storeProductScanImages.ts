import { storeProductScanImageUrls } from "./storeProductScanImageUrls";
import type { ProductScanResult } from "./types/ProductScanResult";

type StoreProductScanImagesOptions = {
  product: ProductScanResult;
  token?: string;
};

export const storeProductScanImages = async ({
  product,
  token,
}: StoreProductScanImagesOptions): Promise<ProductScanResult> => {
  const [assets, productImages] = await Promise.all([
    storeProductScanImageUrls({
      category: "product-assets",
      filenamePrefix: product.name || "asset",
      token,
      urls: product.assets,
    }),
    storeProductScanImageUrls({
      category: "product-images",
      filenamePrefix: product.name || "product-image",
      token,
      urls: product.productImages,
    }),
  ]);

  return {
    ...product,
    assetKeys: assets.keys,
    assets: assets.urls,
    productImageKeys: productImages.keys,
    productImages: productImages.urls,
  };
};
