import { z } from "zod";
import { blogItemSchema } from "./blogItemSchema";

export const blogDownloadRequestSchema = z.object({
  blog: blogItemSchema,
});
