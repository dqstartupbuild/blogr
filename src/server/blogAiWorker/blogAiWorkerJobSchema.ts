import { z } from "zod";
import { blogGenerateRequestSchema } from "@/app/api/blogs/generate/schema";
import { productScanRequestSchema } from "@/app/api/product/scan/schema";
import { topicBatchPlanRequestSchema } from "@/app/api/topics/batch-plan/schema";
import { topicDiscoverRequestSchema } from "@/app/api/topics/discover/schema";

const optionalAuthValueSchema = z.string().min(1).optional();

const blogImageRegenerateInputSchema = z.object({
  alt: z.string(),
  currentFeatureImageUrl: z.string().optional(),
  imageIndex: z.number().optional(),
  isFeatureImage: z.boolean().optional(),
  mdx: z.string(),
  previousUrl: z.string().optional(),
  productId: z.string().optional(),
  prompt: z.string().min(1),
  sectionHeading: z.string().optional(),
  sectionIndex: z.number().int().nonnegative().optional(),
});

export const blogAiWorkerJobSchema = z.discriminatedUnion("type", [
  z.object({
    convexAuthToken: optionalAuthValueSchema,
    input: blogGenerateRequestSchema,
    type: z.literal("blog.generate"),
    userId: optionalAuthValueSchema,
  }),
  z.object({
    input: topicDiscoverRequestSchema,
    type: z.literal("topic.discover"),
  }),
  z.object({
    input: topicDiscoverRequestSchema.extend({
      topicId: z.string().min(1),
      topicKeyword: z.string().min(1),
    }),
    type: z.literal("topic.brief"),
  }),
  z.object({
    input: topicBatchPlanRequestSchema,
    type: z.literal("topic.batchPlan"),
  }),
  z.object({
    convexAuthToken: optionalAuthValueSchema,
    input: blogImageRegenerateInputSchema,
    type: z.literal("blog.regenerateImage"),
    userId: optionalAuthValueSchema,
  }),
  z.object({
    convexAuthToken: optionalAuthValueSchema,
    input: productScanRequestSchema,
    type: z.literal("product.scan"),
    userId: optionalAuthValueSchema,
  }),
]);

export type BlogAiWorkerJob = z.infer<typeof blogAiWorkerJobSchema>;
