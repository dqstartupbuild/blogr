import { z } from "zod";

export const productScanRequestSchema = z.object({
  niche: z.string().optional(),
  productId: z.string().optional(),
  websiteUrl: z.string().min(1, "Add your website first."),
});
