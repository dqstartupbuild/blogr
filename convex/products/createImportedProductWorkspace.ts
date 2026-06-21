import type { MutationCtx } from "../_generated/server";

export const createImportedProductWorkspace = async (
  ctx: MutationCtx,
  userId: string,
) => {
  const now = Date.now();

  return await ctx.db.insert("products", {
    userId,
    websiteUrl: "",
    name: "Imported workspace",
    description: "Your existing content was moved here.",
    niche: "",
    audience: "",
    competitors: "",
    colors: ["#000000", "#ffffff"],
    assets: [],
    productImages: [],
    siteLinks: [],
    rawContext: "",
    scannedAt: now,
    createdAt: now,
    updatedAt: now,
  });
};
