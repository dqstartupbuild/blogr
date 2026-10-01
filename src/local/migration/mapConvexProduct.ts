import type { LocalProduct } from "../domain/LocalState";
import { defaultBlogGenerationSettings } from "@/features/workspace/constants/defaultBlogGenerationSettings";
import type { ConvexRecord } from "./ConvexRecord";
import { sourceArray, sourceNumber, sourceObject, sourceString } from "./sourceValue";
import { stableLocalId } from "./stableLocalId";

export const mapConvexProduct = (source: ConvexRecord): LocalProduct => {
  const integration = sourceObject(source, "blogPublishingIntegration");
  return {
    id: stableLocalId("products", source._id),
    createdAt: sourceNumber(source, "createdAt", sourceNumber(source, "_creationTime")),
    updatedAt: sourceNumber(source, "updatedAt", sourceNumber(source, "_creationTime")),
    scannedAt: sourceNumber(source, "scannedAt", sourceNumber(source, "_creationTime")),
    name: sourceString(source, "name"), websiteUrl: sourceString(source, "websiteUrl"),
    description: sourceString(source, "description"), niche: sourceString(source, "niche"),
    audience: sourceString(source, "audience"), competitors: sourceString(source, "competitors"),
    colors: sourceArray(source, "colors") as string[], externalLinks: sourceArray(source, "externalLinks") as LocalProduct["externalLinks"],
    features: sourceArray(source, "features") as string[], offers: sourceArray(source, "offers") as string[],
    pricing: sourceArray(source, "pricing") as LocalProduct["pricing"], assets: sourceArray(source, "assets") as string[],
    assetKeys: sourceArray(source, "assetKeys") as string[], productImages: sourceArray(source, "productImages") as string[],
    productImageKeys: sourceArray(source, "productImageKeys") as string[], siteLinks: sourceArray(source, "siteLinks") as LocalProduct["siteLinks"],
    rawContext: sourceString(source, "rawContext"),
    calendarQueueSettings: (sourceObject(source, "calendarQueueSettings") || { cadence: "daily" }) as LocalProduct["calendarQueueSettings"],
    blogGenerationSettings: (sourceObject(source, "blogGenerationSettings") || defaultBlogGenerationSettings) as LocalProduct["blogGenerationSettings"],
    blogPublishingIntegration: integration ? {
      enabled: integration.enabled === true, hasAccessToken: false,
      sourceName: sourceString(integration, "sourceName"), webhookUrl: sourceString(integration, "webhookUrl"),
      updatedAt: typeof integration.updatedAt === "number" ? integration.updatedAt : undefined,
    } : undefined,
  };
};
