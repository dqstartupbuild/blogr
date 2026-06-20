import { z } from "zod";

export const blogImageSchema = z.object({
  alt: z.string(),
  prompt: z.string(),
  url: z.string(),
});
