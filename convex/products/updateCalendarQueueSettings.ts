import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { patchProductProfile } from "../readModels/patchProductProfile";
import { touchProductWorkspaceSummary } from "../readModels/touchProductWorkspaceSummary";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { assertCalendarQueueSettings } from "./assertCalendarQueueSettings";
import { calendarQueueSettingsValidator } from "./calendarQueueSettingsValidator";
import { resolveActiveProductId } from "./resolveActiveProductId";
import { v } from "convex/values";

export const updateCalendarQueueSettings = mutation({
  args: { productId: v.id("products"), settings: calendarQueueSettingsValidator },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await resolveActiveProductId(ctx, userId, args.productId);
    assertCalendarQueueSettings(args.settings);
    const now = Date.now();
    await ctx.db.patch(args.productId, { calendarQueueSettings: args.settings, updatedAt: now });
    const touched = await touchProductWorkspaceSummary(ctx, userId, args.productId, now);
    const patched = await patchProductProfile(ctx, userId, args.productId, { calendarQueueSettings: args.settings, updatedAt: now });
    if (touched && patched) return;
    const product = await ctx.db.get(args.productId);
    if (!product || product.userId !== userId) throw new Error("Workspace not found.");
    await upsertProductWorkspaceSummary(ctx, product); await upsertProductProfile(ctx, product);
  },
});
