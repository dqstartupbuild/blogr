import type { LocalProduct } from "../domain/LocalState";

const editableKeys = ["name", "websiteUrl", "niche", "description", "audience", "competitors", "colors", "externalLinks", "features", "offers", "pricing", "assets", "assetKeys", "productImages", "productImageKeys", "siteLinks", "rawContext"] as const;

export const applyProductFields = (product: LocalProduct, fields: Record<string, unknown>): void => {
  for (const key of editableKeys) {
    if (Object.hasOwn(fields, key)) Object.assign(product, { [key]: fields[key] });
  }
  product.updatedAt = Math.max(Date.now(), product.updatedAt + 1);
};
