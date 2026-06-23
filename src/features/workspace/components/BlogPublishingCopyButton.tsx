"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { copyTextToClipboard } from "../utils/copyTextToClipboard";
import { SecondaryButton } from "./SecondaryButton";

type BlogPublishingCopyButtonProps = {
  copiedLabel?: string;
  label: string;
  text: string;
};

export const BlogPublishingCopyButton = ({
  copiedLabel = "Copied",
  label,
  text,
}: BlogPublishingCopyButtonProps) => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  };
  const isCopied = copyState === "copied";
  const buttonLabel =
    copyState === "failed" ? "Could not copy" : isCopied ? copiedLabel : label;

  return (
    <SecondaryButton onClick={handleCopy} type="button">
      {isCopied ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Clipboard size={16} aria-hidden="true" />
      )}
      {buttonLabel}
    </SecondaryButton>
  );
};
