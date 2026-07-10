import { z } from "zod";

export const productExternalLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});
