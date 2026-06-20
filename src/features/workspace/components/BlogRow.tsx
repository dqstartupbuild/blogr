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
      className={`grid w-full gap-3 rounded-md border bg-white p-4 text-left text-black transition hover:bg-black hover:text-white ${
        isSelected ? "border-black" : "border-black"
      }`}
      onClick={() => setSelectedBlogId(blog.id)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <FileText
          className="mt-1 shrink-0"
          size={18}
          aria-hidden="true"
        />
        <StatusBadge status={blog.status} />
      </div>
      <div>
        <p className="text-sm font-semibold">{blog.title}</p>
        <p className="mt-2 line-clamp-2 text-sm">
          {blog.excerpt}
        </p>
      </div>
    </button>
  );
};
