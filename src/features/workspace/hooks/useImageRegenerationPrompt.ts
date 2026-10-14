"use client";

import { useState } from "react";
import { buildImagePromptDraft } from "../utils/buildImagePromptDraft";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";

type UseImageRegenerationPromptOptions = {
  alt: string;
  blogId?: string;
  imageIndex?: number;
  isFeatureImage?: boolean;
  prompt?: string;
  regenerateImage?: RegenerateBlogImage;
  src?: string;
};

export const useImageRegenerationPrompt = ({
  alt,
  blogId,
  imageIndex,
  isFeatureImage = false,
  prompt,
  regenerateImage,
  src,
}: UseImageRegenerationPromptOptions) => {
  const initialPromptDraft = buildImagePromptDraft({ alt, prompt });
  const [promptDraft, setPromptDraft] = useState(initialPromptDraft);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState("");
  const canRegenerate = Boolean(blogId && regenerateImage && src);

  const openPromptDialog = () => {
    if (!canRegenerate) {
      return;
    }

    setError("");
    setPromptDraft(initialPromptDraft);
    setIsPromptDialogOpen(true);
  };

  const closePromptDialog = () => {
    if (isRegenerating) {
      return;
    }

    setIsPromptDialogOpen(false);
  };

  const regenerateFromPrompt = async (nextPrompt: string) => {
    const trimmedNextPrompt = nextPrompt.trim();

    if (!canRegenerate || !regenerateImage || !blogId || !src || !trimmedNextPrompt) {
      return;
    }

    setIsRegenerating(true);
    setError("");

    try {
      await regenerateImage(blogId, {
        alt,
        imageIndex,
        isFeatureImage,
        prompt: trimmedNextPrompt,
        src,
      });
      setIsPromptDialogOpen(false);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Could not refresh that image.";
      setError(message);
      throw caught;
    } finally {
      setIsRegenerating(false);
    }
  };

  return {
    canRegenerate,
    closePromptDialog,
    error,
    isPromptDialogOpen,
    isRegenerating,
    openPromptDialog,
    promptDraft,
    regenerateFromPrompt,
    updatePromptDraft: setPromptDraft,
  };
};
