import { FileText } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { BlogItem } from "../types/BlogItem";

type BlogRowProps = {
  blog: BlogItem;
  isSelected: boolean;
  setSelectedBlogId: (blogId: string) => void;
};

export const BlogRow = ({
  blog,
  isSelected,
  setSelectedBlogId,
}: BlogRowProps) => {
  return (
    <button
      className={`grid w-full gap-3 rounded-md border bg-white p-4 text-left transition hover:border-[#1d2320] ${
        isSelected ? "border-[#1d2320]" : "border-[#e6e0d4]"
      }`}
      onClick={() => setSelectedBlogId(blog.id)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <FileText
          className="mt-1 shrink-0 text-[#2563eb]"
          size={18}
          aria-hidden="true"
        />
        <StatusBadge status={blog.status} />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#1d2320]">{blog.title}</p>
        <p className="mt-2 line-clamp-2 text-sm text-[#66736b]">
          {blog.excerpt}
        </p>
      </div>
    </button>
  );
};
