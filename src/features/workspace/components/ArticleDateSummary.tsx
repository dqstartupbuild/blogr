import { formatWorkspaceDate } from "../utils/formatWorkspaceDate";
import { getBlogPublishedAt } from "../utils/getBlogPublishedAt";
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
  const publishedAt = getBlogPublishedAt(blog);

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
      <span>
        <span className="font-semibold text-black/50">Published</span>{" "}
        {publishedAt ? formatWorkspaceDate(publishedAt) : "Not yet"}
      </span>
    </span>
  );
};
