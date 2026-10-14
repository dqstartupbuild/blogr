import { scanProductWebsite } from "./scanProductWebsite";
import { storeProductScanImages } from "./storeProductScanImages";
import type { ProductScanResult } from "./types/ProductScanResult";

type ScanAndStoreProductWebsiteOptions = {
  niche?: string;
  token?: string;
  userId?: string;
  websiteUrl: string;
};

export const scanAndStoreProductWebsite = async ({
  niche,
  token,
  userId,
  websiteUrl,
}: ScanAndStoreProductWebsiteOptions): Promise<ProductScanResult> => {
  const product = await scanProductWebsite({
    nicheHint: niche,
    websiteUrl,
  });

  return await storeProductScanImages({
    product,
    token,
    userId,
  });
};
