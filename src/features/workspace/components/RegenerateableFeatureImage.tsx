"use client";

import Image from "next/image";
import { ImagePromptDialog } from "./ImagePromptDialog";
import { RegenerateImageButton } from "./RegenerateImageButton";
import { useImageRegenerationPrompt } from "../hooks/useImageRegenerationPrompt";
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
  const imageRegeneration = useImageRegenerationPrompt({
    alt,
    blogId,
    imageIndex,
    isFeatureImage: true,
    prompt,
    regenerateImage,
    src,
  });

  if (!src) {
    return null;
  }

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
        {imageRegeneration.canRegenerate ? (
          <div className="absolute right-3 top-3">
            <RegenerateImageButton
              aria-haspopup="dialog"
              isRegenerating={imageRegeneration.isRegenerating}
              onClick={imageRegeneration.openPromptDialog}
            />
          </div>
        ) : null}
      </div>
      <ImagePromptDialog
        error={imageRegeneration.error}
        isOpen={imageRegeneration.isPromptDialogOpen}
        isRegenerating={imageRegeneration.isRegenerating}
        onClose={imageRegeneration.closePromptDialog}
        onPromptChange={imageRegeneration.updatePromptDraft}
        onRegenerate={imageRegeneration.regenerateFromPrompt}
        prompt={imageRegeneration.promptDraft}
      />
      {imageRegeneration.error ? (
        <p className="text-xs font-medium text-red-600">
          {imageRegeneration.error}
        </p>
      ) : null}
    </figure>
  );
};
