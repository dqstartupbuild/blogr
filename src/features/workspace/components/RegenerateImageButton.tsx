"use client";

import { Loader2, RefreshCw } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type RegenerateImageButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isRegenerating: boolean;
  label?: string;
};

export const RegenerateImageButton = ({
  isRegenerating,
  label = "Regenerate",
  ...props
}: RegenerateImageButtonProps) => {
  return (
    <button
      aria-label={label}
      className="inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-black/20 bg-white px-2.5 text-xs font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isRegenerating}
      type="button"
      {...props}
    >
      {isRegenerating ? (
        <Loader2 size={14} aria-hidden="true" className="animate-spin" />
      ) : (
        <RefreshCw size={14} aria-hidden="true" />
      )}
      {isRegenerating ? "Regenerating..." : label}
    </button>
  );
};