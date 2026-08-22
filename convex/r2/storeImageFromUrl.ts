import { v } from "convex/values";
import { action } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { buildR2ImageKey } from "./buildR2ImageKey";
import { getImageExtensionFromContentType } from "./getImageExtensionFromContentType";
import { getR2ImageUrl } from "./getR2ImageUrl";
import { r2 } from "./client";

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
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const response = await fetch(args.url);

    if (!response.ok) {
      throw new Error("Could not download image.");
    }

    const contentType = response.headers.get("content-type") || "image/png";

    if (!contentType.startsWith("image/")) {
      throw new Error("Downloaded file is not an image.");
    }

    const blob = await response.blob();
    const extension = getImageExtensionFromContentType(contentType);
    const key = buildR2ImageKey({
      category: args.category,
      extension,
      filenameHint: args.filenameHint,
      userId,
    });
    const storedKey = await r2.store(ctx, blob, {
      cacheControl: "public, max-age=31536000, immutable",
      key,
      type: contentType,
    });

    return {
      key: storedKey,
      url: await getR2ImageUrl(storedKey),
    };
  },
});
