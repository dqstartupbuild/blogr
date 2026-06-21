import { storeImageUrlWithConvexR2 } from "../r2/storeImageUrlWithConvexR2";
import type { R2ImageCategory } from "../r2/types/R2ImageCategory";

type StoreProductScanImageUrlsOptions = {
  category: R2ImageCategory;
  filenamePrefix: string;
  token?: string;
  urls: string[];
};

export const storeProductScanImageUrls = async ({
  category,
  filenamePrefix,
  token,
  urls,
}: StoreProductScanImageUrlsOptions) => {
  const storedImages = await Promise.all(
    urls.map((url, index) =>
      storeImageUrlWithConvexR2({
        category,
        filenameHint: `${filenamePrefix}-${index + 1}`,
        token,
        url,
      }),
    ),
  );

  return {
    keys: storedImages
      .map((image) => image?.key)
      .filter((key): key is string => Boolean(key)),
    urls: storedImages.map((image, index) => image?.url || urls[index]),
  };
};
