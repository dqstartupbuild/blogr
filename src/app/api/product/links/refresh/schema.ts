import { z } from "zod";

export const productLinksRefreshRequestSchema = z.object({
  websiteUrl: z.string().min(1, "Add your website first."),
});
