import { getImageUrlPathKey } from "./getImageUrlPathKey";
import type { BlogImage } from "./types/BlogImage";

type ResolveRegenerateImageTargetOptions = {
  alt?: string;
  images: BlogImage[];
  imageIndex?: number;
  prompt?: string;
  src?: string;
};

type ResolveRegenerateImageTargetResult = {
  imageIndex: number | null;
  prompt: string;
  alt: string;
};

export const resolveRegenerateImageTarget = ({
  alt,
  images,
  imageIndex,
  prompt,
  src,
}: ResolveRegenerateImageTargetOptions): ResolveRegenerateImageTargetResult | null => {
  const matchByIndex =
    typeof imageIndex === "number" && imageIndex >= 0 && imageIndex < images.length
      ? imageIndex
      : null;

  const matchBySrc = (() => {
    if (!src) {
      return null;
    }

    const exactIndex = images.findIndex((image) => image.url === src);

    if (exactIndex >= 0) {
      return exactIndex;
    }

    const pathKey = getImageUrlPathKey(src);
    const pathIndex = images.findIndex(
      (image) => getImageUrlPathKey(image.url) === pathKey,
    );

    return pathIndex >= 0 ? pathIndex : null;
  })();

  const resolvedIndex = matchByIndex ?? matchBySrc;
  const existingImage =
    resolvedIndex !== null ? images[resolvedIndex] : undefined;
  const resolvedPrompt =
    prompt?.trim() ||
    existingImage?.prompt?.trim() ||
    (alt?.trim() ? `Create a clear, on-topic blog image showing: ${alt.trim()}` : "");

  if (!resolvedPrompt) {
    return null;
  }

  return {
    alt: alt?.trim() || existingImage?.alt || "",
    imageIndex: resolvedIndex,
    prompt: resolvedPrompt,
  };
};