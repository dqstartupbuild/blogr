import { v } from "convex/values";

export const productPriceValidator = v.object({
  billingPeriod: v.optional(v.string()),
  details: v.optional(v.string()),
  name: v.string(),
  price: v.string(),
});
