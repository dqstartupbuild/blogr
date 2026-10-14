import { randomUUID } from "node:crypto";
import type { LocalProduct } from "../../domain/LocalState";
import { defaultBlogGenerationSettings } from "@/features/workspace/constants/defaultBlogGenerationSettings";

export const blankProduct = (name: string, websiteUrl = "", niche = ""): LocalProduct => ({
  id: randomUUID(), createdAt: Date.now(), updatedAt: Date.now(), name: name.trim() || "New workspace", websiteUrl, niche,
  description: "", audience: "", competitors: "", colors: ["#000000", "#ffffff"], externalLinks: [], features: [], offers: [], pricing: [], assets: [], productImages: [], siteLinks: [], rawContext: "", calendarQueueSettings: { cadence: "daily" }, blogGenerationSettings: defaultBlogGenerationSettings,
});
