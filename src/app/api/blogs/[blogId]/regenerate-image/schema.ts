import { z } from "zod";

export const regenerateImageRequestSchema = z.object({
  alt: z.string().optional(),
  imageIndex: z.number().int().min(0).optional(),
  isFeatureImage: z.boolean().optional(),
  productId: z.string().optional(),
  prompt: z.string().optional(),
  src: z.string().optional(),
});