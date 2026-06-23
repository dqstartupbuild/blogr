import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { blogGenerationSettingsValidator } from "./products/blogGenerationSettingsValidator";
import { blogPublishingIntegrationValidator } from "./products/blogPublishingIntegrationValidator";

const linkValidator = v.object({
  title: v.string(),
  url: v.string(),
  reason: v.optional(v.string()),
});

const imageValidator = v.object({
  alt: v.string(),
  prompt: v.string(),
  r2Key: v.optional(v.string()),
  url: v.string(),
});

export default defineSchema({
  products: defineTable({
    userId: v.string(),
    websiteUrl: v.string(),
    name: v.string(),
    description: v.string(),
    niche: v.string(),
    audience: v.string(),
    competitors: v.string(),
    colors: v.array(v.string()),
    assets: v.array(v.string()),
    assetKeys: v.optional(v.array(v.string())),
    productImages: v.array(v.string()),
    productImageKeys: v.optional(v.array(v.string())),
    siteLinks: v.array(linkValidator),
    blogGenerationSettings: v.optional(blogGenerationSettingsValidator),
    blogPublishingIntegration: v.optional(blogPublishingIntegrationValidator),
    rawContext: v.string(),
    scannedAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"]),

  workspaceSelections: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  topics: defineTable({
    userId: v.string(),
    productId: v.optional(v.id("products")),
    keyword: v.string(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("saved"),
      v.literal("writing"),
      v.literal("written"),
      v.literal("failed"),
    ),
    blogId: v.optional(v.id("blogs")),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_userId_productId_createdAt", [
      "userId",
      "productId",
      "createdAt",
    ]),

  blogs: defineTable({
    userId: v.string(),
    productId: v.optional(v.id("products")),
    topicId: v.optional(v.id("topics")),
    keyword: v.string(),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("ready"),
      v.literal("failed"),
    ),
    mdx: v.string(),
    featureImageUrl: v.optional(v.string()),
    images: v.array(imageValidator),
    internalLinks: v.array(linkValidator),
    youtubeVideos: v.array(linkValidator),
    sources: v.array(linkValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"])
    .index("by_userId_productId_updatedAt", [
      "userId",
      "productId",
      "updatedAt",
    ])
    .index("by_topicId", ["topicId"]),
});
