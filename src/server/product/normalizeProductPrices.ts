import type { ProductPrice } from "@/features/workspace/types/ProductPrice";

export const normalizeProductPrices = (value: unknown): ProductPrice[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const price = item as Record<string, unknown>;
    const name = typeof price.name === "string" ? price.name.trim() : "";
    const amount = typeof price.price === "string" ? price.price.trim() : "";

    if (!name && !amount) {
      return [];
    }

    return [
      {
        billingPeriod:
          typeof price.billingPeriod === "string"
            ? price.billingPeriod.trim() || undefined
            : undefined,
        details:
          typeof price.details === "string"
            ? price.details.trim() || undefined
            : undefined,
        name: name || "Plan",
        price: amount || "Contact for pricing",
      },
    ];
  });
};
