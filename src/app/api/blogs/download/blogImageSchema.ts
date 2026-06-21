import { z } from "zod";

export const blogImageSchema = z.object({
  alt: z.string(),
  prompt: z.string(),
  r2Key: z.string().optional(),
  url: z.string(),
});
