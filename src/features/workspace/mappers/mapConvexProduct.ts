import { demoProduct } from "../constants/demoProduct";
import { emptyProduct } from "../constants/emptyProduct";
import type { ProductProfile } from "../types/ProductProfile";

type ConvexProductLike = Partial<ProductProfile> | null | undefined;

export const mapConvexProduct = (
  product: ConvexProductLike,
): ProductProfile => {
  if (!product) {
    return emptyProduct;
  }

  return {
    ...emptyProduct,
    ...product,
    colors: product?.colors || demoProduct.colors,
    externalLinks: product?.externalLinks || emptyProduct.externalLinks,
    features: product?.features || emptyProduct.features,
    offers: product?.offers || emptyProduct.offers,
    pricing: product?.pricing || emptyProduct.pricing,
    siteLinks: product?.siteLinks || emptyProduct.siteLinks,
  };
};
