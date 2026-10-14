import { z } from "zod";
import { isValidCalendarDate } from "./isValidCalendarDate";

const short = z.string().max(10000);
const timestamp = z.number().int().nonnegative().finite();
const link = z.object({ title: short, url: short, isActive: z.boolean().optional(), reason: short.optional() });
const image = z.object({ alt: short, prompt: short, url: short, sectionHeading: short.optional(), sectionIndex: z.number().int().nonnegative().optional() });
const settings = z.object({
  articleStyle: z.enum(["Informative", "Simple and Clear", "Formal", "Casual", "Enthusiastic", "Persuasive", "Professional", "Friendly", "Entertaining", "Inspirational", "Analytical", "Narrative"]), associateBrandLinks: z.array(z.object({ title: short, description: short, url: short })).max(5),
  globalArticleInstructions: short, internalLinksPerArticle: z.number().int().min(0).max(5),
  imageStyle: z.enum(["Sketch", "Realistic", "Illustration", "Brand & Text", "Title-Based"]), imagesPerArticle: z.enum(["None", "Feature Only", "Feature +2", "Feature +3", "Feature +4"]), tableOfContents: z.boolean(), youtubeVideo: z.boolean(),
  callToAction: z.boolean(), includeInfographics: z.boolean(), mentionSimilarProducts: z.boolean(), firstPersonWriting: z.boolean(),
});
const calendarSettings = z.discriminatedUnion("cadence", [
  z.object({ cadence: z.literal("daily") }),
  z.object({ cadence: z.literal("weekly"), weekday: z.number().int().min(0).max(6) }),
  z.object({ cadence: z.literal("monthly"), dayOfMonth: z.number().int().min(1).max(31) }),
  z.object({ cadence: z.literal("custom"), intervalDays: z.number().int().min(1).max(365), anchorDate: z.string().refine(isValidCalendarDate) }),
]);
const product = z.object({
  id: z.string().uuid(), createdAt: timestamp, updatedAt: timestamp, scannedAt: timestamp.optional(),
  name: short, websiteUrl: short, niche: short, audience: short, competitors: short, description: short,
  colors: z.array(short), externalLinks: z.array(z.object({ label: short, url: short })),
  features: z.array(short), offers: z.array(short), pricing: z.array(z.object({ name: short, price: short, billingPeriod: short.optional(), details: short.optional() })),
  assets: z.array(short), assetKeys: z.array(short).optional(), productImages: z.array(short), productImageKeys: z.array(short).optional(), siteLinks: z.array(link),
  rawContext: z.string().max(2000000), calendarQueueSettings: calendarSettings, blogGenerationSettings: settings.optional(),
  blogPublishingIntegration: z.object({ enabled: z.boolean(), hasAccessToken: z.boolean(), sourceName: short, webhookUrl: short, updatedAt: timestamp.optional() }).optional(),
});
const topic = z.object({
  id: z.string().uuid(), productId: z.string().uuid(), keyword: short, status: z.enum(["saved", "scheduled", "writing", "written", "published", "failed"]),
  blogId: z.string().uuid().optional(), canonicalKeyword: short.optional(), intentKey: short.optional(), notes: z.string().max(100000).optional(),
  scheduledDate: z.string().refine(isValidCalendarDate).optional(), sourceType: z.enum(["manual", "discovery", "gap", "comparison", "question", "cluster", "refresh", "aeo", "difficulty"]).optional(),
  createdAt: timestamp.optional(), updatedAt: timestamp.optional(), lastError: short.optional(),
});
const blog = z.object({
  id: z.string().uuid(), productId: z.string().uuid(), topicId: z.string().uuid().optional(), keyword: short, title: short,
  seoTitle: short, slug: short, excerpt: z.string().max(100000), mdx: z.string().max(5000000),
  status: z.enum(["draft", "ready", "failed", "published"]), updatedAt: timestamp, createdAt: timestamp.optional(), publishedAt: timestamp.optional(),
  featureImageUrl: short.optional(), images: z.array(image), internalLinks: z.array(link), youtubeVideos: z.array(link), sources: z.array(link), tags: z.array(short),
});
const version = blog.extend({ blogId: z.string().uuid(), archivedAt: timestamp, versionNumber: z.number().int().positive() });
export const localStateSchema = z.object({
  schemaVersion: z.literal(1), revision: z.number().int().nonnegative(), activeProductId: z.string().uuid().nullable(),
  products: z.array(product), topics: z.array(topic), blogs: z.array(blog), blogVersions: z.array(version),
}).superRefine((state, ctx) => {
  const productIds = new Set(state.products.map((item) => item.id));
  const topicIds = new Set(state.topics.map((item) => item.id));
  const blogIds = new Set(state.blogs.map((item) => item.id));
  if (productIds.size !== state.products.length || topicIds.size !== state.topics.length || blogIds.size !== state.blogs.length) ctx.addIssue({ code: "custom", message: "Duplicate record ID" });
  if (state.activeProductId && !productIds.has(state.activeProductId)) ctx.addIssue({ code: "custom", message: "Missing active product" });
  for (const item of [...state.topics, ...state.blogs]) if (!productIds.has(item.productId)) ctx.addIssue({ code: "custom", message: "Record belongs to missing product" });
  for (const item of state.topics) if (item.blogId && !state.blogs.some((blog) => blog.id === item.blogId && blog.productId === item.productId)) ctx.addIssue({ code: "custom", message: "Topic points to missing article" });
  for (const item of state.blogs) if (item.topicId && !state.topics.some((topic) => topic.id === item.topicId && topic.productId === item.productId)) ctx.addIssue({ code: "custom", message: "Article points to missing topic" });
  const versionKeys = new Set<string>();
  for (const item of state.blogVersions) {
    const blog = state.blogs.find((candidate) => candidate.id === item.blogId);
    if (!blog || blog.productId !== item.productId) ctx.addIssue({ code: "custom", message: "Version belongs to missing article" });
    const key = `${item.blogId}:${item.versionNumber}`;
    if (versionKeys.has(key)) ctx.addIssue({ code: "custom", message: "Duplicate article version" });
    versionKeys.add(key);
  }
});
