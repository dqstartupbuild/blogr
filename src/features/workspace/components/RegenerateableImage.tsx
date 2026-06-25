"use client";

import Image from "next/image";
import { useState } from "react";
import { RegenerateImageButton } from "./RegenerateImageButton";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";

type RegenerateableImageProps = {
  alt: string;
  blogId?: string;
  imageIndex?: number;
  isFeatureImage?: boolean;
  prompt?: string;
  regenerateImage?: RegenerateBlogImage;
  src?: string;
};

export const RegenerateableImage = ({
  alt,
  blogId,
  imageIndex,
  isFeatureImage = false,
  prompt,
  regenerateImage,
  src,
}: RegenerateableImageProps) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState("");

  if (!src) {
    return null;
  }

  const canRegenerate = Boolean(
    blogId && typeof imageIndex === "number" && prompt && regenerateImage,
  );

  const handleRegenerate = async () => {
    if (!canRegenerate || !regenerateImage || !blogId || typeof imageIndex !== "number" || !prompt) {
      return;
    }

    setIsRegenerating(true);
    setError("");

    try {
      await regenerateImage(blogId, {
        alt,
        imageIndex,
        isFeatureImage,
        prompt,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not refresh that image.");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <figure className="my-4 grid gap-2">
      <div className="relative overflow-hidden rounded-md border border-black/10 bg-black/5">
        <Image
          alt={alt}
          className="h-auto w-full object-cover"
          height={720}
          src={src}
          unoptimized
          width={1280}
        />
        {canRegenerate ? (
          <div className="absolute right-2 top-2">
            <RegenerateImageButton
              isRegenerating={isRegenerating}
              onClick={handleRegenerate}
            />
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </figure>
  );
};