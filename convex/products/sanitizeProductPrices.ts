import type { Doc } from "../_generated/dataModel";

export const sanitizeProductPrices = (
  prices: NonNullable<Doc<"products">["pricing"]>,
) => {
  return prices.flatMap((price) => {
    const name = price.name.trim();
    const amount = price.price.trim();

    if (!name && !amount) {
      return [];
    }

    return [
      {
        billingPeriod: price.billingPeriod?.trim() || undefined,
        details: price.details?.trim() || undefined,
        name: name || "Plan",
        price: amount || "Contact for pricing",
      },
    ];
  });
};
