import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const getCurrentProductProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const selection = await ctx.db
      .query("workspaceSelections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const selectedProfile = selection
      ? await ctx.db
          .query("productProfiles")
          .withIndex("by_userId_productId", (q) =>
            q.eq("userId", userId).eq("productId", selection.productId),
          )
          .first()
      : null;
    const profile =
      selectedProfile ||
      (await ctx.db
        .query("productProfiles")
        .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
        .order("desc")
        .first());

    if (profile) {
      return {
        audience: profile.audience,
        blogGenerationSettings: profile.blogGenerationSettings,
        blogPublishingIntegration: profile.blogPublishingIntegration,
        colors: profile.colors,
        description: profile.description,
        name: profile.name,
        niche: profile.niche,
        siteLinks: profile.siteLinks,
        updatedAt: profile.updatedAt,
        websiteUrl: profile.websiteUrl,
      };
    }

    return null;
  },
});
