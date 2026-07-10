import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { saveWorkspaceSelection } from "../workspaceSelections/saveWorkspaceSelection";
import { defaultBlogGenerationSettings } from "./defaultBlogGenerationSettings";

export const createProductWorkspace = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.optional(v.string()),
    niche: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const name = args.name.trim() || "New workspace";
    const websiteUrl = args.websiteUrl?.trim() || "";
    const niche = args.niche?.trim() || "";
    const product = {
      userId,
      websiteUrl,
      name,
      description: "Add a site to fill in this workspace.",
      niche,
      audience: "",
      competitors: "",
      colors: ["#000000", "#ffffff"],
      externalLinks: [],
      features: [],
      offers: [],
      pricing: [],
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
    await saveWorkspaceSelection(ctx, userId, productId);

    return productId;
  },
});
