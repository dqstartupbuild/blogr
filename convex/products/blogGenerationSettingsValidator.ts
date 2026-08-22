import { v } from "convex/values";

const associateBrandLinkValidator = v.object({
  description: v.string(),
  title: v.string(),
  url: v.string(),
});

export const blogGenerationSettingsValidator = v.object({
  articleStyle: v.union(
    v.literal("Informative"),
    v.literal("Simple and Clear"),
    v.literal("Formal"),
    v.literal("Casual"),
    v.literal("Enthusiastic"),
    v.literal("Persuasive"),
    v.literal("Professional"),
    v.literal("Friendly"),
    v.literal("Entertaining"),
    v.literal("Inspirational"),
    v.literal("Analytical"),
    v.literal("Narrative"),
  ),
  associateBrandLinks: v.optional(v.array(associateBrandLinkValidator)),
  globalArticleInstructions: v.string(),
  internalLinksPerArticle: v.union(
    v.literal(0),
    v.literal(1),
    v.literal(2),
    v.literal(3),
    v.literal(4),
    v.literal(5),
  ),
  imageStyle: v.union(
    v.literal("Sketch"),
    v.literal("Realistic"),
    v.literal("Illustration"),
    v.literal("Brand & Text"),
    v.literal("Title-Based"),
  ),
  imagesPerArticle: v.union(
    v.literal("None"),
    v.literal("Feature Only"),
    v.literal("Feature +2"),
    v.literal("Feature +3"),
    v.literal("Feature +4"),
  ),
  tableOfContents: v.boolean(),
  youtubeVideo: v.boolean(),
  callToAction: v.boolean(),
  includeInfographics: v.boolean(),
  mentionSimilarProducts: v.boolean(),
  firstPersonWriting: v.boolean(),
});
