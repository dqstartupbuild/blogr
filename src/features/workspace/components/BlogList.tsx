import { BlogRow } from "./BlogRow";
import { EmptyState } from "./EmptyState";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogListProps = {
  blogs: BlogItem[];
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  savePlan: SaveDiscoveryPlan;
  selectedBlogId: string;
  setSelectedBlogId: (blogId: string) => void;
};

export const BlogList = ({
  blogs,
  discoverBlogRefreshIdeas,
  savePlan,
  selectedBlogId,
  setSelectedBlogId,
}: BlogListProps) => {
  if (blogs.length === 0) {
    return <EmptyState label="No blogs yet." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(160px,0.7fr)_120px_120px_250px] gap-4 border-b border-black/10 px-4 py-3 text-sm font-semibold text-black/60 xl:grid">
        <span>Title</span>
        <span>Topic</span>
        <span>Status</span>
        <span>Updated</span>
        <span className="text-right">Actions</span>
      </div>
      {blogs.map((blog) => (
        <BlogRow
          blog={blog}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          isSelected={blog.id === selectedBlogId}
          key={blog.id}
          savePlan={savePlan}
          setSelectedBlogId={setSelectedBlogId}
        />
      ))}
    </div>
  );
};
