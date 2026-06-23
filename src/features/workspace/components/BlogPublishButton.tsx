"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import { publishBlog } from "../utils/publishBlog";
import type { BlogItem } from "../types/BlogItem";

type BlogPublishButtonProps = {
  blog: BlogItem;
};

export const BlogPublishButton = ({ blog }: BlogPublishButtonProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState("");

  const handlePublish = async () => {
    setIsPublishing(true);
    setMessage("");

    try {
      setMessage(await publishBlog(blog));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish yet.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {message ? (
        <span className="text-xs font-medium text-black">{message}</span>
      ) : null}
      <SecondaryButton
        disabled={isPublishing}
        onClick={handlePublish}
        type="button"
      >
        <Send size={16} aria-hidden="true" />
        {isPublishing ? "Publishing" : "Publish"}
      </SecondaryButton>
    </div>
  );
};
