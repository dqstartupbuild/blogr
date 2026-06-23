import { FileText } from "lucide-react";
import { BlogRefreshLauncher } from "./BlogRefreshLauncher";
import { StatusBadge } from "./StatusBadge";
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
  return (
    <article
      className={`grid gap-3 rounded-md border bg-white p-4 text-black ${
        isSelected ? "border-black" : "border-black"
      }`}
    >
      <button
        className="grid w-full gap-3 text-left text-black transition hover:opacity-70"
        onClick={() => setSelectedBlogId(blog.id)}
        type="button"
      >
        <div className="flex items-start justify-between gap-3">
          <FileText className="mt-1 shrink-0" size={18} aria-hidden="true" />
          <StatusBadge status={blog.status} />
        </div>
        <div>
          <p className="text-sm font-semibold">{blog.title}</p>
          <p className="mt-2 line-clamp-2 text-sm">{blog.excerpt}</p>
        </div>
      </button>
      <div className="flex justify-end">
        <BlogRefreshLauncher
          blog={blog}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          savePlan={savePlan}
        />
      </div>
    </article>
  );
};
