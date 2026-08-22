"use client";

import Image from "next/image";
import { ImageActionsMenu } from "./ImageActionsMenu";
import { ImageAltTextDialog } from "./ImageAltTextDialog";
import { ImagePromptDialog } from "./ImagePromptDialog";
import { ImageRepositionDialog } from "./ImageRepositionDialog";
import { useBlogImageActions } from "../hooks/useBlogImageActions";
import { useImageRegenerationPrompt } from "../hooks/useImageRegenerationPrompt";
import type { BlogImageItem } from "../types/BlogImageItem";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";

type RegenerateableImageProps = {
  alt: string;
  blogId?: string;
  imageIndex?: number;
  images?: BlogImageItem[];
  isFeatureImage?: boolean;
  mdx?: string;
  prompt?: string;
  regenerateImage?: RegenerateBlogImage;
  src?: string;
  title?: string;
  updateBlogImages?: UpdateBlogImages;
  variant?: "body" | "feature";
};

export const RegenerateableImage = ({
  alt,
  blogId,
  imageIndex,
  images = [],
  isFeatureImage = false,
  mdx = "",
  prompt,
  regenerateImage,
  src,
  title = "",
  updateBlogImages,
  variant = "body",
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
  const imageActions = useBlogImageActions({
    alt,
    blogId,
    imageIndex,
    images,
    isFeatureImage,
    mdx,
    title,
    updateBlogImages,
  });

  if (!src) {
    return null;
  }

  return (
    <figure
      className={variant === "feature" ? "mt-6 grid gap-2" : "my-4 grid gap-2"}
    >
      <div className="relative">
        <div
          className={
            variant === "feature"
              ? "relative aspect-video w-full overflow-hidden rounded-md border border-black/10 bg-black/5"
              : "overflow-hidden rounded-md border border-black/10 bg-black/5"
          }
        >
          {variant === "feature" ? (
            <Image alt={alt} className="object-cover" fill src={src} unoptimized />
          ) : (
            <Image
              alt={alt}
              className="h-auto w-full object-cover"
              height={720}
              src={src}
              unoptimized
              width={1280}
            />
          )}
        </div>
        {imageRegeneration.canRegenerate || imageActions.canManage ? (
          <div className="absolute right-2 top-2">
            <ImageActionsMenu
              isBusy={imageRegeneration.isRegenerating || imageActions.isSaving}
              onEditAlt={
                imageActions.canManage ? imageActions.openAltDialog : undefined
              }
              onMakeFeature={
                imageActions.canMakeFeature
                  ? imageActions.makeFeature
                  : undefined
              }
              onMove={
                imageActions.canMove ? imageActions.openMoveDialog : undefined
              }
              onRegenerate={
                imageRegeneration.canRegenerate
                  ? imageRegeneration.openPromptDialog
                  : undefined
              }
              onRemove={
                imageActions.canManage ? imageActions.remove : undefined
              }
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
      <ImageAltTextDialog
        alt={imageActions.currentAlt}
        error={imageActions.error}
        isOpen={imageActions.isAltDialogOpen}
        isSaving={imageActions.isSaving}
        key={`${imageActions.currentAlt}:${imageActions.isAltDialogOpen}`}
        onClose={imageActions.closeAltDialog}
        onSave={imageActions.saveAlt}
      />
      <ImageRepositionDialog
        alt={imageActions.currentAlt}
        currentSectionHeading={imageActions.currentSectionHeading}
        error={imageActions.error}
        isOpen={imageActions.isMoveDialogOpen}
        isSaving={imageActions.isSaving}
        key={`${imageActions.currentSectionHeading}:${imageActions.isMoveDialogOpen}`}
        onClose={imageActions.closeMoveDialog}
        onMove={imageActions.saveMove}
        sectionHeadings={imageActions.sectionHeadings}
      />
      {imageRegeneration.error || imageActions.error ? (
        <p className="text-xs font-medium text-red-600">
          {imageRegeneration.error || imageActions.error}
        </p>
      ) : null}
    </figure>
  );
};
