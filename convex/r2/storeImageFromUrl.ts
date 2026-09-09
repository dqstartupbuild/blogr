import { v } from "convex/values";
import { action } from "../_generated/server";
import { storeImageFromUrlActionHandler } from "./storeImageFromUrlActionHandler";

export const storeImageFromUrl = action({
  args: {
    category: v.union(
      v.literal("blog-images"),
      v.literal("product-assets"),
      v.literal("product-images"),
    ),
    filenameHint: v.optional(v.string()),
    url: v.string(),
  },
  handler: storeImageFromUrlActionHandler,
});
