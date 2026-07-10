"use client";

import { useState } from "react";
import { buildBlogFeatureImageSwapChanges } from "../utils/buildBlogFeatureImageSwapChanges";
import { buildBlogImageAltChanges } from "../utils/buildBlogImageAltChanges";
import { buildBlogImageMoveChanges } from "../utils/buildBlogImageMoveChanges";
import { buildBlogImageRemovalChanges } from "../utils/buildBlogImageRemovalChanges";
import { getBlogImageSectionHeading } from "../utils/getBlogImageSectionHeading";
import { getBlogSectionHeadings } from "../utils/getBlogSectionHeadings";
import type { BlogImageChanges } from "../types/BlogImageChanges";
import type { BlogImageItem } from "../types/BlogImageItem";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";

type UseBlogImageActionsOptions = {
  alt: string;
  blogId?: string;
  imageIndex?: number;
  images: BlogImageItem[];
  isFeatureImage: boolean;
  mdx: string;
  title: string;
  updateBlogImages?: UpdateBlogImages;
};

export const useBlogImageActions = ({
  alt,
  blogId,
  imageIndex,
  images,
  isFeatureImage,
  mdx,
  title,
  updateBlogImages,
}: UseBlogImageActionsOptions) => {
  const [isAltDialogOpen, setIsAltDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const resolvedImageIndex =
    typeof imageIndex === "number" && imageIndex >= 0 ? imageIndex : null;
  const currentImage =
    resolvedImageIndex !== null ? images[resolvedImageIndex] : undefined;
  const canManage = Boolean(
    blogId && updateBlogImages && currentImage && resolvedImageIndex !== null,
  );
  const currentAlt = currentImage?.alt || alt;
  const currentSectionHeading = currentImage
    ? getBlogImageSectionHeading({ mdx, url: currentImage.url }) ||
      currentImage.sectionHeading ||
      ""
    : "";
  const sectionHeadings = getBlogSectionHeadings(mdx);

  const saveChanges = async (changes: BlogImageChanges) => {
    if (!blogId || !updateBlogImages) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateBlogImages(blogId, changes);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Could not update that image.";
      setError(message);
      throw caught;
    } finally {
      setIsSaving(false);
    }
  };

  const makeFeature = () => {
    if (resolvedImageIndex === null) return;

    void saveChanges(
      buildBlogFeatureImageSwapChanges({
        imageIndex: resolvedImageIndex,
        images,
        mdx,
        title,
      }),
    ).catch(() => undefined);
  };

  const remove = () => {
    if (
      resolvedImageIndex === null ||
      !window.confirm("Remove this image from the article?")
    ) {
      return;
    }

    void saveChanges(
      buildBlogImageRemovalChanges({
        imageIndex: resolvedImageIndex,
        images,
        mdx,
        title,
      }),
    ).catch(() => undefined);
  };

  const saveAlt = async (nextAlt: string) => {
    if (resolvedImageIndex === null) return;

    await saveChanges(
      buildBlogImageAltChanges({
        alt: nextAlt,
        imageIndex: resolvedImageIndex,
        images,
        mdx,
        title,
      }),
    );
    setIsAltDialogOpen(false);
  };

  const saveMove = async (sectionHeading: string) => {
    if (resolvedImageIndex === null) return;

    await saveChanges(
      buildBlogImageMoveChanges({
        imageIndex: resolvedImageIndex,
        images,
        mdx,
        sectionHeading,
        title,
      }),
    );
    setIsMoveDialogOpen(false);
  };

  return {
    canMakeFeature: canManage && !isFeatureImage && resolvedImageIndex !== 0,
    canManage,
    canMove: canManage && !isFeatureImage && resolvedImageIndex !== 0,
    closeAltDialog: () => setIsAltDialogOpen(false),
    closeMoveDialog: () => setIsMoveDialogOpen(false),
    currentAlt,
    currentSectionHeading,
    error,
    isAltDialogOpen,
    isMoveDialogOpen,
    isSaving,
    makeFeature,
    openAltDialog: () => {
      setError("");
      setIsAltDialogOpen(true);
    },
    openMoveDialog: () => {
      setError("");
      setIsMoveDialogOpen(true);
    },
    remove,
    saveAlt,
    saveMove,
    sectionHeadings,
  };
};
