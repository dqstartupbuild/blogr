import type { LinkItem } from "../types/LinkItem";
import type { ProductScanProduct } from "../types/ProductScanProduct";

type BuildPendingProductScanProductOptions = {
  existingSiteLinks?: LinkItem[];
  initialProduct: ProductScanProduct;
};

export const buildPendingProductScanProduct = ({
  existingSiteLinks,
  initialProduct,
}: BuildPendingProductScanProductOptions): ProductScanProduct => {
  if (!existingSiteLinks) {
    return initialProduct;
  }

  return {
    ...initialProduct,
    siteLinks: existingSiteLinks,
  };
};
