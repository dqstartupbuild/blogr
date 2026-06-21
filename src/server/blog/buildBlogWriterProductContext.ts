import type { StoredProduct } from "./types/StoredProduct";

export const buildBlogWriterProductContext = (product: StoredProduct) => {
  return JSON.stringify(
    {
      audience: product.audience,
      colors: product.colors,
      competitors: product.competitors,
      description: product.description,
      name: product.name,
      niche: product.niche,
      rawContext: product.rawContext,
      siteLinks: product.siteLinks,
      websiteUrl: product.websiteUrl,
    },
    null,
    2,
  );
};
