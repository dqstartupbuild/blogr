import { z } from "zod";

export const blogUpdateRequestSchema = z.object({
  excerpt: z.string().min(1, "Add a short summary."),
  mdx: z.string().min(1, "Add the blog body."),
  title: z.string().min(1, "Add a title."),
});
