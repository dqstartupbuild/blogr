import { ArticleVersionHistoryListItem } from "./ArticleVersionHistoryListItem";
import type { ArticleVersionSummary } from "../types/ArticleVersionSummary";

type ArticleVersionHistoryListProps = {
  onSelect: (versionId: string) => void;
  selectedVersionId: string;
  versions: ArticleVersionSummary[];
};

export const ArticleVersionHistoryList = ({
  onSelect,
  selectedVersionId,
  versions,
}: ArticleVersionHistoryListProps) => {
  return (
    <nav aria-label="Older article versions" className="min-w-0">
      <ul className="divide-y divide-black/10 overflow-hidden rounded-md bg-white">
        {versions.map((version) => (
          <ArticleVersionHistoryListItem
            isSelected={version.id === selectedVersionId}
            key={version.id}
            onSelect={onSelect}
            version={version}
          />
        ))}
      </ul>
    </nav>
  );
};
