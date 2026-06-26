import { z } from "zod";

export const associateBrandLinkSchema = z.object({
  description: z.string(),
  title: z.string(),
  url: z.string(),
});
