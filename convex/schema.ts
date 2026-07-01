import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { blogGenerationSettingsValidator } from "./products/blogGenerationSettingsValidator";
import { blogPublishingIntegrationValidator } from "./products/blogPublishingIntegrationValidator";
import { topicSourceTypeValidator } from "./topics/topicSourceTypeValidator";
import { topicStatusValidator } from "./topics/topicStatusValidator";

const aiJobStatusValidator = v.union(
  v.literal("queued"),
  v.literal("running"),
  v.literal("succeeded"),
  v.literal("failed"),
);

const aiJobTypeValidator = v.union(
  v.literal("blog.generate"),
  v.literal("topic.discover"),
  v.literal("topic.brief"),
  v.literal("topic.batchPlan"),
  v.literal("blog.regenerateImage"),
  v.literal("product.scan"),
);

const linkValidator = v.object({
  isActive: v.optional(v.boolean()),
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

const blogStatusValidator = v.union(
  v.literal("draft"),
  v.literal("ready"),
  v.literal("failed"),
  v.literal("published"),
);

const publicBlogPublishingIntegrationValidator = v.object({
  enabled: v.boolean(),
  hasAccessToken: v.boolean(),
  sourceName: v.string(),
  updatedAt: v.optional(v.number()),
  webhookUrl: v.string(),
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

  productWorkspaceSummaries: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    name: v.string(),
    niche: v.string(),
    websiteUrl: v.string(),
    updatedAt: v.number(),
  })
    .index("by_productId", ["productId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"]),

  productProfiles: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    websiteUrl: v.string(),
    name: v.string(),
    description: v.string(),
    niche: v.string(),
    audience: v.string(),
    colors: v.array(v.string()),
    siteLinks: v.array(linkValidator),
    blogGenerationSettings: v.optional(blogGenerationSettingsValidator),
    blogPublishingIntegration: v.optional(publicBlogPublishingIntegrationValidator),
    updatedAt: v.number(),
  })
    .index("by_productId", ["productId"])
    .index("by_userId_productId", ["userId", "productId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"]),

  workspaceStats: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    topicCount: v.number(),
    blogCount: v.number(),
    publishedBlogCount: v.number(),
    imageCount: v.number(),
    updatedAt: v.number(),
  })
    .index("by_productId", ["productId"])
    .index("by_userId_productId", ["userId", "productId"]),

  topics: defineTable({
    userId: v.string(),
    productId: v.optional(v.id("products")),
    keyword: v.string(),
    canonicalKeyword: v.optional(v.string()),
    intentKey: v.optional(v.string()),
    searchText: v.optional(v.string()),
    notes: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    sourceType: v.optional(topicSourceTypeValidator),
    status: topicStatusValidator,
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
    ])
    .index("by_userId_productId_status_createdAt", [
      "userId",
      "productId",
      "status",
      "createdAt",
    ])
    .index("by_userId_productId_scheduledDate", [
      "userId",
      "productId",
      "scheduledDate",
    ])
    .searchIndex("search_user_topics", {
      searchField: "searchText",
      filterFields: ["userId"],
    })
    .searchIndex("search_product_topics", {
      searchField: "searchText",
      filterFields: ["userId", "productId"],
    }),

  topicKeywordOptions: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    topicId: v.id("topics"),
    keyword: v.string(),
    searchText: v.optional(v.string()),
    canonicalKeyword: v.optional(v.string()),
    intentKey: v.optional(v.string()),
    notes: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    sourceType: v.optional(topicSourceTypeValidator),
    status: topicStatusValidator,
    isScheduled: v.boolean(),
    blogId: v.optional(v.id("blogs")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_topicId", ["topicId"])
    .index("by_userId_productId_updatedAt", [
      "userId",
      "productId",
      "updatedAt",
    ])
    .index("by_userId_productId_status_updatedAt", [
      "userId",
      "productId",
      "status",
      "updatedAt",
    ])
    .index("by_userId_productId_status_isScheduled_updatedAt", [
      "userId",
      "productId",
      "status",
      "isScheduled",
      "updatedAt",
    ])
    .index("by_userId_productId_isScheduled_updatedAt", [
      "userId",
      "productId",
      "isScheduled",
      "updatedAt",
    ])
    .index("by_userId_productId_scheduledDate", [
      "userId",
      "productId",
      "scheduledDate",
    ])
    .searchIndex("search_product_topic_options", {
      searchField: "searchText",
      filterFields: ["userId", "productId", "status", "isScheduled"],
    }),

  blogs: defineTable({
    userId: v.string(),
    productId: v.optional(v.id("products")),
    topicId: v.optional(v.id("topics")),
    keyword: v.string(),
    searchText: v.optional(v.string()),
    title: v.string(),
    seoTitle: v.optional(v.string()),
    slug: v.string(),
    excerpt: v.string(),
    status: blogStatusValidator,
    mdx: v.string(),
    featureImageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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
    .index("by_userId_productId_status_updatedAt", [
      "userId",
      "productId",
      "status",
      "updatedAt",
    ])
    .index("by_userId_productId_keyword_updatedAt", [
      "userId",
      "productId",
      "keyword",
      "updatedAt",
    ])
    .index("by_topicId", ["topicId"])
    .searchIndex("search_user_blogs", {
      searchField: "searchText",
      filterFields: ["userId"],
    })
    .searchIndex("search_product_blogs", {
      searchField: "searchText",
      filterFields: ["userId", "productId"],
    }),

  blogSummaries: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    blogId: v.id("blogs"),
    topicId: v.optional(v.id("topics")),
    keyword: v.string(),
    searchText: v.optional(v.string()),
    title: v.string(),
    seoTitle: v.optional(v.string()),
    slug: v.string(),
    excerpt: v.string(),
    status: blogStatusValidator,
    isPublished: v.boolean(),
    featureImageUrl: v.optional(v.string()),
    imageCount: v.number(),
    wordCount: v.number(),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_blogId", ["blogId"])
    .index("by_topicId", ["topicId"])
    .index("by_userId_productId_updatedAt", [
      "userId",
      "productId",
      "updatedAt",
    ])
    .index("by_userId_productId_isPublished_updatedAt", [
      "userId",
      "productId",
      "isPublished",
      "updatedAt",
    ])
    .index("by_userId_productId_keyword_updatedAt", [
      "userId",
      "productId",
      "keyword",
      "updatedAt",
    ])
    .index("by_userId_productId_isPublished_keyword_updatedAt", [
      "userId",
      "productId",
      "isPublished",
      "keyword",
      "updatedAt",
    ])
    .searchIndex("search_product_blog_summaries", {
      searchField: "searchText",
      filterFields: ["userId", "productId", "isPublished", "keyword"],
    }),

  blogKeywordOptions: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    blogId: v.id("blogs"),
    keyword: v.string(),
    title: v.string(),
    excerpt: v.string(),
    updatedAt: v.number(),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userId_productId_updatedAt", [
      "userId",
      "productId",
      "updatedAt",
    ]),

  aiJobs: defineTable({
    userId: v.string(),
    productId: v.optional(v.id("products")),
    topicId: v.optional(v.id("topics")),
    blogId: v.optional(v.id("blogs")),
    type: aiJobTypeValidator,
    status: aiJobStatusValidator,
    input: v.any(),
    result: v.optional(v.any()),
    error: v.optional(v.string()),
    attempts: v.number(),
    leaseExpiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_productId_createdAt", ["productId", "createdAt"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_status_updatedAt", ["status", "updatedAt"]),
});
