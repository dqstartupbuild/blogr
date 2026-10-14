"use client";

import { useMemo, useState } from "react";
import { usePaginatedQuery, useQuery } from "@/local/client/hooks";
import { ArticleVersionHistoryList } from "./ArticleVersionHistoryList";
import { ArticleVersionPreview } from "./ArticleVersionPreview";
import { SecondaryButton } from "./SecondaryButton";
import { castBlogId } from "@/local/client/castBlogId";
import { castBlogVersionId } from "@/local/client/castBlogVersionId";
import { castProductId } from "@/local/client/castProductId";
import { getBlogVersionQuery } from "@/local/client/references/getBlogVersionQuery";
import { listBlogVersionsQuery } from "@/local/client/references/listBlogVersionsQuery";
import { mapLocalBlogVersion } from "../mappers/mapLocalBlogVersion";
import type { ArticleVersionSummary } from "../types/ArticleVersionSummary";
import type { BlogItem } from "../types/BlogItem";

type ArticleVersionHistoryContentProps = {
  blog: BlogItem;
};

export const ArticleVersionHistoryContent = ({
  blog,
}: ArticleVersionHistoryContentProps) => {
  const productId = blog.productId ? castProductId(blog.productId) : undefined;
  const {
    loadMore,
    results: versionsResult,
    status: versionsStatus,
  } = usePaginatedQuery(
    listBlogVersionsQuery,
    {
      blogId: castBlogId(blog.id),
      productId,
    },
    { initialNumItems: 20 },
  );
  const versions = useMemo(
    () => (versionsResult || []) as ArticleVersionSummary[],
    [versionsResult],
  );
  const [requestedVersionId, setRequestedVersionId] = useState("");
  const selectedVersionId = versions.some(
    (version) => version.id === requestedVersionId,
  )
    ? requestedVersionId
    : versions[0]?.id || "";

  const versionResult = useQuery(
    getBlogVersionQuery,
    selectedVersionId
      ? {
          blogId: castBlogId(blog.id),
          productId,
          versionId: castBlogVersionId(selectedVersionId),
        }
      : "skip",
  );
  const selectedVersion = useMemo(
    () => (versionResult ? mapLocalBlogVersion(versionResult) : undefined),
    [versionResult],
  );

  if (versionsStatus === "LoadingFirstPage") {
    return (
      <p className="py-10 text-center text-sm text-black/60">
        Loading version history.
      </p>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-base font-semibold text-black">No older versions yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/60">
          The current article will move here the next time you choose Write blog
          for its topic.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
      <div className="min-w-0">
        <p className="mb-2 text-sm font-semibold text-black">
          {versions.length} older {versions.length === 1 ? "version" : "versions"}
        </p>
        <ArticleVersionHistoryList
          onSelect={setRequestedVersionId}
          selectedVersionId={selectedVersionId}
          versions={versions}
        />
        {versionsStatus === "CanLoadMore" ||
        versionsStatus === "LoadingMore" ? (
          <div className="mt-3">
            <SecondaryButton
              disabled={versionsStatus === "LoadingMore"}
              onClick={() => loadMore(20)}
              type="button"
            >
              {versionsStatus === "LoadingMore"
                ? "Loading older versions"
                : "Show older versions"}
            </SecondaryButton>
          </div>
        ) : null}
      </div>
      <div className="min-w-0">
        {selectedVersion ? (
          <ArticleVersionPreview version={selectedVersion} />
        ) : (
          <p className="py-10 text-center text-sm text-black/60">
            Loading this version.
          </p>
        )}
      </div>
    </div>
  );
};
