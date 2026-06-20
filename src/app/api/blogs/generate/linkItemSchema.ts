import { z } from "zod";

export const linkItemSchema = z.object({
  reason: z.string().optional(),
  title: z.string(),
  url: z.string(),
});
