import { fetchAction } from "convex/nextjs";
import { getOptionalConvexAuthToken } from "../auth/getOptionalConvexAuthToken";
import { isAuthDisabledForPreview } from "../auth/isAuthDisabledForPreview";
import { castProductId } from "../convex/castProductId";
import { hasConvexUrl } from "../convex/hasConvexUrl";
import { indexProductContextAction } from "../convex/references/indexProductContextAction";
import type { ProductScanResult } from "../product/types/ProductScanResult";

type IndexProductRagContextOptions = {
  product: ProductScanResult;
  productId?: string;
  token?: string;
};

export const indexProductRagContext = async ({
  product,
  productId,
  token,
}: IndexProductRagContextOptions) => {
  if (!hasConvexUrl() || !productId) {
    return;
  }

  try {
    const authToken = token ?? (await getOptionalConvexAuthToken());

    if (!authToken && !isAuthDisabledForPreview()) {
      return;
    }

    await fetchAction(
      indexProductContextAction,
      {
        audience: product.audience,
        competitors: product.competitors,
        description: product.description,
        externalLinks: product.externalLinks,
        features: product.features,
        name: product.name,
        niche: product.niche,
        offers: product.offers,
        pricing: product.pricing,
        productId: castProductId(productId),
        rawContext: product.rawContext,
        siteLinks: product.siteLinks,
        websiteUrl: product.websiteUrl,
      },
      { token: authToken },
    );
  } catch {
    return;
  }
};
