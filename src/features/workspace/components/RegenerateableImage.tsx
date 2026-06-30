"use client";

import Image from "next/image";
import { ImagePromptDialog } from "./ImagePromptDialog";
import { RegenerateImageButton } from "./RegenerateImageButton";
import { useImageRegenerationPrompt } from "../hooks/useImageRegenerationPrompt";
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
  const imageRegeneration = useImageRegenerationPrompt({
    alt,
    blogId,
    imageIndex,
    isFeatureImage,
    prompt,
    regenerateImage,
    src,
  });

  if (!src) {
    return null;
  }

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
        {imageRegeneration.canRegenerate ? (
          <div className="absolute right-2 top-2">
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
