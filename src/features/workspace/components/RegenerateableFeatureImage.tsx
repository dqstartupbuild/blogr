"use client";

import Image from "next/image";
import { useState } from "react";
import { RegenerateImageButton } from "./RegenerateImageButton";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";

type RegenerateableFeatureImageProps = {
  alt: string;
  blogId?: string;
  imageIndex?: number;
  prompt?: string;
  regenerateImage?: RegenerateBlogImage;
  src?: string;
};

export const RegenerateableFeatureImage = ({
  alt,
  blogId,
  imageIndex,
  prompt,
  regenerateImage,
  src,
}: RegenerateableFeatureImageProps) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState("");

  if (!src) {
    return null;
  }

  const canRegenerate = Boolean(blogId && regenerateImage);

  const handleRegenerate = async () => {
    if (!canRegenerate || !regenerateImage || !blogId) {
      return;
    }

    setIsRegenerating(true);
    setError("");

    try {
      await regenerateImage(blogId, {
        alt,
        imageIndex,
        isFeatureImage: true,
        prompt,
        src,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not refresh that image.");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <figure className="mt-6 grid gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-black/10 bg-black/5">
        <Image
          alt={alt}
          className="object-cover"
          fill
          src={src}
          unoptimized
        />
        {canRegenerate ? (
          <div className="absolute right-3 top-3">
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