import { filterActiveLinks } from "@/features/workspace/utils/filterActiveLinks";
import type { StoredProduct } from "./types/StoredProduct";

export const buildBlogWriterProductContext = (product: StoredProduct) => {
  return JSON.stringify(
    {
      audience: product.audience,
      colors: product.colors,
      competitors: product.competitors,
      description: product.description,
      externalLinks: product.externalLinks,
      features: product.features,
      name: product.name,
      niche: product.niche,
      offers: product.offers,
      pricing: product.pricing,
      rawContext: product.rawContext,
      siteLinks: filterActiveLinks(product.siteLinks),
      websiteUrl: product.websiteUrl,
    },
    null,
    2,
  );
};
