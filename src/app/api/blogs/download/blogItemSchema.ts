import { z } from "zod";
import { linkItemSchema } from "../generate/linkItemSchema";
import { blogImageSchema } from "./blogImageSchema";

export const blogItemSchema = z.object({
  createdAt: z.number().optional(),
  excerpt: z.string(),
  featureImageUrl: z.string().optional(),
  id: z.string(),
  images: z.array(blogImageSchema).default([]),
  internalLinks: z.array(linkItemSchema).default([]),
  keyword: z.string(),
  mdx: z.string(),
  productId: z.string().optional(),
  slug: z.string(),
  sources: z.array(linkItemSchema).default([]),
  seoTitle: z.string().default(""),
  status: z.union([
    z.literal("draft"),
    z.literal("ready"),
    z.literal("failed"),
    z.literal("published"),
  ]),
  title: z.string(),
  updatedAt: z.number(),
  youtubeVideos: z.array(linkItemSchema).default([]),
});
