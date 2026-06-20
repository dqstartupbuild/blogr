import { z } from "zod";
import { storedProductSchema } from "./storedProductSchema";

export const blogGenerateRequestSchema = z.object({
  keyword: z.string().trim().min(1, "Choose a topic first."),
  product: storedProductSchema,
});
