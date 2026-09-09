import type { ActionCtx } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { detectRasterImageFormat } from "../../shared/raster/detectRasterImageFormat";
import { buildR2ImageKey } from "./buildR2ImageKey";
import { getR2ImageUrl } from "./getR2ImageUrl";
import { r2 } from "./client";

type StoreImageFromUrlActionHandlerArgs = {
  category: "blog-images" | "product-assets" | "product-images";
  filenameHint?: string;
  url: string;
};

export const storeImageFromUrlActionHandler = async (
  ctx: ActionCtx,
  args: StoreImageFromUrlActionHandlerArgs,
) => {
  const userId = await requireUserId(ctx);
  const response = await fetch(args.url);

  if (!response.ok) {
    throw new Error("Could not download image.");
  }

  const body = await response.arrayBuffer();
  const format = detectRasterImageFormat(body);

  if (!format) {
    throw new Error("Downloaded file is not an image.");
  }

  const blob = new Blob([body], { type: format.contentType });
  const key = buildR2ImageKey({
    category: args.category,
    extension: format.extension,
    filenameHint: args.filenameHint,
    userId,
  });
  const storedKey = await r2.store(ctx, blob, {
    cacheControl: "public, max-age=31536000, immutable",
    key,
    type: format.contentType,
  });

  return {
    key: storedKey,
    url: await getR2ImageUrl(storedKey),
  };
};
