import { z } from "zod";

const linkItemSchema = z.object({
  isActive: z.boolean().optional(),
  reason: z.string().optional(),
  title: z.string(),
  url: z.string(),
});

const batchPlanProductSchema = z.object({
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
  canonicalKeyword: z.string().optional(),
  intentKey: z.string().optional(),
  keyword: z.string(),
  scheduledDate: z.string().optional(),
});

const existingBlogSchema = z.object({
  excerpt: z.string().optional(),
  keyword: z.string().default(""),
  title: z.string().default(""),
  updatedAt: z.number().optional(),
});

export const topicBatchPlanRequestSchema = z.object({
  blankDates: z.array(z.string()).max(30).default([]),
  existingBlogs: z.array(existingBlogSchema).default([]),
  existingTopics: z.array(existingTopicSchema).default([]),
  product: batchPlanProductSchema,
  productId: z.string().min(1, "Choose a workspace first."),
});
