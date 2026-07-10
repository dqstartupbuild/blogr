import type { Doc, Id } from "../_generated/dataModel";

export type ProductProfileSource = {
  _id: Id<"products">;
  userId: string;
  websiteUrl: string;
  name: string;
  description: string;
  niche: string;
  audience: string;
  competitors: string;
  colors: string[];
  externalLinks?: Doc<"products">["externalLinks"];
  features?: string[];
  offers?: string[];
  pricing?: Doc<"products">["pricing"];
  siteLinks: Doc<"products">["siteLinks"];
  blogGenerationSettings?: Doc<"products">["blogGenerationSettings"];
  blogPublishingIntegration?: Doc<"products">["blogPublishingIntegration"];
  updatedAt: number;
};
