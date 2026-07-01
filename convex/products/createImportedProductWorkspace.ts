import type { MutationCtx } from "../_generated/server";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { defaultBlogGenerationSettings } from "./defaultBlogGenerationSettings";

export const createImportedProductWorkspace = async (
  ctx: MutationCtx,
  userId: string,
) => {
  const now = Date.now();

  const product = {
    userId,
    websiteUrl: "",
    name: "Imported workspace",
    description: "Your existing content was moved here.",
    niche: "",
    audience: "",
    competitors: "",
    colors: ["#000000", "#ffffff"],
    assets: [],
    assetKeys: [],
    productImages: [],
    productImageKeys: [],
    siteLinks: [],
    blogGenerationSettings: defaultBlogGenerationSettings,
    rawContext: "",
    scannedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  const productId = await ctx.db.insert("products", product);

  await upsertProductWorkspaceSummary(ctx, {
    ...product,
    _id: productId,
  });
  await upsertProductProfile(ctx, {
    ...product,
    _id: productId,
  });

  return productId;
};
