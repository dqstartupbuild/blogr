import { z } from "zod";

export const productPriceSchema = z.object({
  billingPeriod: z.string().optional(),
  details: z.string().optional(),
  name: z.string(),
  price: z.string(),
});
