import Link from "next/link";
import { Edit3, FileText } from "lucide-react";
import { BlogRefreshLauncher } from "./BlogRefreshLauncher";
import { StatusBadge } from "./StatusBadge";
import { countBlogWords } from "../utils/countBlogWords";
import { formatCountLabel } from "../utils/formatCountLabel";
import { formatWorkspaceDate } from "../utils/formatWorkspaceDate";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogRowProps = {
  blog: BlogItem;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  isSelected: boolean;
  savePlan: SaveDiscoveryPlan;
  setSelectedBlogId: (blogId: string) => void;
};

export const BlogRow = ({
  blog,
  discoverBlogRefreshIdeas,
  isSelected,
  savePlan,
  setSelectedBlogId,
}: BlogRowProps) => {
  const wordCount = countBlogWords(blog.mdx);

  return (
    <article
      className={`grid gap-4 border-b border-black/10 bg-white p-4 text-black last:border-b-0 xl:grid-cols-[minmax(0,1.4fr)_minmax(160px,0.7fr)_120px_120px_250px] xl:items-center ${
        isSelected ? "bg-black/5" : ""
      }`}
    >
      <button
        className="flex min-w-0 items-start gap-3 text-left text-black transition hover:opacity-70"
        onClick={() => setSelectedBlogId(blog.id)}
        type="button"
      >
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black text-white">
          <FileText size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-6">
            {blog.title}
          </span>
          <span className="mt-1 block text-sm text-black/60">
            {wordCount > 0 ? formatCountLabel(wordCount, "word") : "Draft"}
          </span>
        </span>
      </button>
      <div>
        <p className="mb-1 text-xs font-semibold text-black/50 xl:hidden">
          Topic
        </p>
        <p className="line-clamp-2 text-sm leading-6 text-black/70">
          {blog.keyword}
        </p>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-black/50 xl:hidden">
          Status
        </p>
        <StatusBadge status={blog.status} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-black/50 xl:hidden">
          Updated
        </p>
        <p className="text-sm text-black/60">
          {formatWorkspaceDate(blog.updatedAt)}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white"
          href={`/blogs/${blog.id}`}
        >
          <Edit3 size={16} aria-hidden="true" />
          Edit
        </Link>
        <BlogRefreshLauncher
          blog={blog}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          savePlan={savePlan}
        />
      </div>
    </article>
  );
};
