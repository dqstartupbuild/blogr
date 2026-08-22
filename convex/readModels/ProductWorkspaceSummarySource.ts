import type { Id } from "../_generated/dataModel";

export type ProductWorkspaceSummarySource = {
  _id: Id<"products">;
  userId: string;
  name: string;
  niche: string;
  websiteUrl: string;
  updatedAt: number;
};
