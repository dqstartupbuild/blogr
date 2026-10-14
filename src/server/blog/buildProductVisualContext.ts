import type { StoredProduct } from "./types/StoredProduct";

export const buildProductVisualContext = (product: StoredProduct) => {
  const colors = product.colors.slice(0, 5).join(", ");
  const features = product.features.slice(0, 6).join(", ");
  const pricing = product.pricing
    .slice(0, 4)
    .map((price) => `${price.name}: ${price.price}`)
    .join(", ");
  const details = [
    product.name ? `Product: ${product.name}` : "",
    product.niche ? `Niche: ${product.niche}` : "",
    product.audience ? `Audience: ${product.audience}` : "",
    product.description ? `What it does: ${product.description.slice(0, 700)}` : "",
    features ? `Key features: ${features}` : "",
    pricing ? `Pricing context: ${pricing}` : "",
    colors ? `Brand colors to use as subtle accents: ${colors}` : "",
  ].filter(Boolean);

  return details.join("\n");
};
