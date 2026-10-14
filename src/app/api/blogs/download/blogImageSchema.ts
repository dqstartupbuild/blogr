import { z } from "zod";

export const blogImageSchema = z.object({
  alt: z.string(),
  prompt: z.string(),
  sectionHeading: z.string().optional(),
  sectionIndex: z.number().int().nonnegative().optional(),
  url: z.string(),
});
