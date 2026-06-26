import { z } from "zod";

export const linkItemSchema = z.object({
  isActive: z.boolean().optional(),
  reason: z.string().optional(),
  title: z.string(),
  url: z.string(),
});
