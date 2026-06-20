import { z } from "zod";
import { linkItemSchema } from "./linkItemSchema";

export const storedProductSchema = z.object({
  assets: z.array(z.string()).default([]),
  audience: z.string(),
  colors: z.array(z.string()).default([]),
  competitors: z.string(),
  description: z.string(),
  name: z.string(),
  niche: z.string(),
  productImages: z.array(z.string()).default([]),
  rawContext: z.string(),
  siteLinks: z.array(linkItemSchema).default([]),
  websiteUrl: z.string(),
});
