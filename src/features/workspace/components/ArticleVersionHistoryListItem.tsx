import { formatWorkspaceDate } from "../utils/formatWorkspaceDate";
import type { ArticleVersionSummary } from "../types/ArticleVersionSummary";

type ArticleVersionHistoryListItemProps = {
  isSelected: boolean;
  onSelect: (versionId: string) => void;
  version: ArticleVersionSummary;
};

export const ArticleVersionHistoryListItem = ({
  isSelected,
  onSelect,
  version,
}: ArticleVersionHistoryListItemProps) => {
  return (
    <li>
      <button
        aria-pressed={isSelected}
        className={`grid w-full gap-1 px-3 py-3 text-left transition ${
          isSelected
            ? "bg-black text-white"
            : "bg-white text-black hover:bg-black/[0.05]"
        }`}
        onClick={() => onSelect(version.id)}
        type="button"
      >
        <span className="text-sm font-semibold">
          Version {version.versionNumber}
        </span>
        <span
          className={`text-xs ${isSelected ? "text-white/70" : "text-black/55"}`}
        >
          Saved {formatWorkspaceDate(version.archivedAt)}
        </span>
      </button>
    </li>
  );
};
