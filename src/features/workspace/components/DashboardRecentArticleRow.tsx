import { ChevronRight, FileText } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatWorkspaceDate } from "../utils/formatWorkspaceDate";
import type { BlogItem } from "../types/BlogItem";

type DashboardRecentArticleRowProps = {
  blog: BlogItem;
  previewBlog: (blogId: string) => void;
};

export const DashboardRecentArticleRow = ({
  blog,
  previewBlog,
}: DashboardRecentArticleRowProps) => {
  return (
    <button
      className="grid w-full gap-3 border-t border-black/10 px-4 py-4 text-left text-black transition hover:bg-black/5 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-center"
      onClick={() => previewBlog(blog.id)}
      type="button"
    >
      <span className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-black text-white">
          <FileText size={17} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {blog.title}
          </span>
          <span className="mt-1 block truncate text-sm text-black/60">
            {blog.keyword}
          </span>
        </span>
      </span>
      <StatusBadge status={blog.status} />
      <span className="text-sm text-black/60">
        {formatWorkspaceDate(blog.updatedAt)}
      </span>
      <ChevronRight size={18} aria-hidden="true" />
    </button>
  );
};
