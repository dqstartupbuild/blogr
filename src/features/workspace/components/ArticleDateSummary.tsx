import { formatWorkspaceDate } from "../utils/formatWorkspaceDate";
import type { BlogItem } from "../types/BlogItem";

type ArticleDateSummaryProps = {
  blog: BlogItem;
  className?: string;
};

export const ArticleDateSummary = ({
  blog,
  className = "grid gap-1 text-sm leading-6 text-black/60",
}: ArticleDateSummaryProps) => {
  const createdAt = blog.createdAt || blog.updatedAt;

  return (
    <span className={className}>
      <span>
        <span className="font-semibold text-black/50">Created</span>{" "}
        {formatWorkspaceDate(createdAt)}
      </span>
      <span>
        <span className="font-semibold text-black/50">Updated</span>{" "}
        {formatWorkspaceDate(blog.updatedAt)}
      </span>
    </span>
  );
};
