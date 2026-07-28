import { ArticleDateSummary } from "./ArticleDateSummary";
import { MarkdownPreview } from "./MarkdownPreview";
import { RegenerateableFeatureImage } from "./RegenerateableFeatureImage";
import { formatWorkspaceDate } from "../utils/formatWorkspaceDate";
import type { ArticleVersionItem } from "../types/ArticleVersionItem";

type ArticleVersionPreviewProps = {
  version: ArticleVersionItem;
};

export const ArticleVersionPreview = ({
  version,
}: ArticleVersionPreviewProps) => {
  return (
    <article className="min-w-0 bg-white">
      <div className="border-b border-black/10 pb-4">
        <p className="text-sm font-semibold text-black/55">
          Version {version.versionNumber}
        </p>
        <h3 className="mt-2 [overflow-wrap:anywhere] text-2xl font-semibold leading-tight text-black">
          {version.title}
        </h3>
        <p className="mt-2 text-sm text-black/55">
          This version was replaced on {formatWorkspaceDate(version.archivedAt)}.
        </p>
        <ArticleDateSummary
          blog={version}
          className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-black/55"
        />
      </div>
      <p className="mt-5 [overflow-wrap:anywhere] text-base leading-7 text-black/65">
        {version.excerpt}
      </p>
      {version.featureImageUrl ? (
        <RegenerateableFeatureImage
          alt={version.images[0]?.alt || version.title}
          src={version.featureImageUrl}
          title={version.title}
        />
      ) : null}
      <div className="mt-5 min-w-0 rounded-md bg-black/[0.025] p-4">
        <MarkdownPreview mdx={version.mdx} title={version.title} />
      </div>
    </article>
  );
};
