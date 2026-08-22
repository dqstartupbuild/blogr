"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { ArticleVersionHistoryDialog } from "./ArticleVersionHistoryDialog";
import { SecondaryButton } from "./SecondaryButton";
import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import type { BlogItem } from "../types/BlogItem";

type ArticleVersionHistoryButtonProps = {
  blog: BlogItem;
};

export const ArticleVersionHistoryButton = ({
  blog,
}: ArticleVersionHistoryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const canLoadVersions =
    isLiveWorkspaceEnabled() && Boolean(blog.productId);

  return (
    <>
      <SecondaryButton onClick={() => setIsOpen(true)} type="button">
        <History size={16} aria-hidden="true" />
        Version history
      </SecondaryButton>
      {isOpen ? (
        <ArticleVersionHistoryDialog
          blog={blog}
          canLoadVersions={canLoadVersions}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
};
