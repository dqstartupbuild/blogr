import { BlogRow } from "./BlogRow";
import { EmptyState } from "./EmptyState";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogListProps = {
  blogs: BlogItem[];
  deleteBlog: (blogId: string) => Promise<void> | void;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  savePlan: SaveDiscoveryPlan;
};

export const BlogList = ({
  blogs,
  deleteBlog,
  discoverBlogRefreshIdeas,
  savePlan,
}: BlogListProps) => {
  if (blogs.length === 0) {
    return <EmptyState label="No blogs yet." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(150px,0.7fr)_110px_110px_360px] gap-4 border-b border-black/10 px-4 py-3 text-sm font-semibold text-black/60 xl:grid">
        <span>Title</span>
        <span>Topic</span>
        <span>Status</span>
        <span>Updated</span>
        <span className="text-right">Actions</span>
      </div>
      {blogs.map((blog) => (
        <BlogRow
          blog={blog}
          deleteBlog={deleteBlog}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          key={blog.id}
          savePlan={savePlan}
        />
      ))}
    </div>
  );
};
