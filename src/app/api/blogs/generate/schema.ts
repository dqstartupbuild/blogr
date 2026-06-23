import { z } from "zod";
import { blogGenerationSettingsSchema } from "./blogGenerationSettingsSchema";
import { storedProductSchema } from "./storedProductSchema";

export const blogGenerateRequestSchema = z.object({
  blogGenerationSettings: blogGenerationSettingsSchema.optional(),
  keyword: z.string().trim().min(1, "Choose a topic first."),
  product: storedProductSchema,
  productId: z.string().optional(),
  sourceText: z
    .string()
    .trim()
    .max(40000, "Keep the pasted text under 40,000 characters.")
    .optional(),
  topicBrief: z
    .string()
    .trim()
    .max(20000, "Keep the topic brief under 20,000 characters.")
    .optional(),
});
