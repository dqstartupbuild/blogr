import { z } from "zod";
import { blogGenerationSettingsSchema } from "./blogGenerationSettingsSchema";
import { linkItemSchema } from "./linkItemSchema";
import { productExternalLinkSchema } from "./productExternalLinkSchema";
import { productPriceSchema } from "./productPriceSchema";

export const storedProductSchema = z.object({
  assets: z.array(z.string()).default([]),
  assetKeys: z.array(z.string()).default([]),
  audience: z.string(),
  blogGenerationSettings: blogGenerationSettingsSchema.optional(),
  colors: z.array(z.string()).default([]),
  competitors: z.string(),
  description: z.string(),
  externalLinks: z.array(productExternalLinkSchema).default([]),
  features: z.array(z.string()).default([]),
  name: z.string(),
  niche: z.string(),
  productImages: z.array(z.string()).default([]),
  productImageKeys: z.array(z.string()).default([]),
  offers: z.array(z.string()).default([]),
  pricing: z.array(productPriceSchema).default([]),
  rawContext: z.string(),
  siteLinks: z.array(linkItemSchema).default([]),
  websiteUrl: z.string(),
});
