"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { downloadBlogZip } from "../utils/downloadBlogZip";
import type { BlogItem } from "../types/BlogItem";

type BlogZipButtonProps = {
  blog: BlogItem;
};

export const BlogZipButton = ({ blog }: BlogZipButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    setIsDownloading(true);
    setMessage("");

    try {
      await downloadBlogZip(blog);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not download yet.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {message ? (
        <span className="text-xs font-medium text-black">{message}</span>
      ) : null}
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-black bg-white px-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed"
        disabled={isDownloading}
        onClick={handleDownload}
        type="button"
      >
        <Download size={16} aria-hidden="true" />
        {isDownloading ? "Zipping" : "Zip"}
      </button>
    </div>
  );
};
