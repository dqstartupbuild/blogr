import { z } from "zod";

const linkItemSchema = z.object({
  isActive: z.boolean().optional(),
  reason: z.string().optional(),
  title: z.string(),
  url: z.string(),
});

const topicDiscoverProductSchema = z.object({
  audience: z.string().default(""),
  competitors: z.string().optional(),
  description: z.string().default(""),
  name: z.string().default(""),
  niche: z.string().default(""),
  rawContext: z.string().optional(),
  siteLinks: z.array(linkItemSchema).default([]),
  websiteUrl: z.string().default(""),
});

const existingTopicSchema = z.object({
  keyword: z.string(),
});

const existingBlogSchema = z.object({
  excerpt: z.string().optional(),
  keyword: z.string().default(""),
  title: z.string().default(""),
  updatedAt: z.number().optional(),
});

export const topicDiscoverRequestSchema = z.object({
  existingBlogs: z.array(existingBlogSchema).default([]),
  existingTopics: z.array(existingTopicSchema).default([]),
  includeAiAnswers: z.boolean().default(false),
  product: topicDiscoverProductSchema,
  productId: z.string().optional(),
  seedKeyword: z.string().trim().max(120).optional(),
});
