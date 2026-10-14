import { z } from "zod";
import { blogItemSchema } from "../download/blogItemSchema";

export const blogPublishRequestSchema = z.object({
  blog: blogItemSchema,
});
