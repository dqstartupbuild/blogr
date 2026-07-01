import type { Doc, Id } from "../_generated/dataModel";

export type ProductProfileSource = {
  _id: Id<"products">;
  userId: string;
  websiteUrl: string;
  name: string;
  description: string;
  niche: string;
  audience: string;
  colors: string[];
  siteLinks: Doc<"products">["siteLinks"];
  blogGenerationSettings?: Doc<"products">["blogGenerationSettings"];
  blogPublishingIntegration?: Doc<"products">["blogPublishingIntegration"];
  updatedAt: number;
};
