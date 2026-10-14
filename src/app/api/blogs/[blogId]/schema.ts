import { z } from "zod";

export const blogUpdateRequestSchema = z.object({
  excerpt: z
    .string()
    .min(110, "Keep the description at least 110 characters.")
    .max(160, "Keep the description under 160 characters."),
  mdx: z.string().min(1, "Add the blog body."),
  seoTitle: z
    .string()
    .min(70, "Keep the SEO title at least 70 characters.")
    .max(110, "Keep the SEO title under 110 characters."),
  title: z.string().min(1, "Add a title."),
});
