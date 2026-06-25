import { z } from "zod";

export const regenerateImageRequestSchema = z.object({
  alt: z.string().min(1, "Add the image description."),
  imageIndex: z.number().int().min(0, "Pick an image to refresh."),
  isFeatureImage: z.boolean().optional(),
  productId: z.string().optional(),
  prompt: z.string().min(1, "Add the image prompt."),
});