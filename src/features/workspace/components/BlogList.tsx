import { BlogRow } from "./BlogRow";
import { EmptyState } from "./EmptyState";
import type { BlogItem } from "../types/BlogItem";
import type { DeleteBlog } from "../types/DeleteBlog";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogListProps = {
  blogs: BlogItem[];
  deleteBlog: DeleteBlog;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  previewBlog: (blogId: string) => void;
  savePlan: SaveDiscoveryPlan;
  selectedBlogId: string;
};

export const BlogList = ({
  blogs,
  deleteBlog,
  discoverBlogRefreshIdeas,
  previewBlog,
  savePlan,
  selectedBlogId,
}: BlogListProps) => {
  if (blogs.length === 0) {
    return <EmptyState label="No blogs yet." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(160px,0.7fr)_120px_120px_340px] gap-4 border-b border-black/10 px-4 py-3 text-sm font-semibold text-black/60 xl:grid">
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
          isSelected={blog.id === selectedBlogId}
          key={blog.id}
          previewBlog={previewBlog}
          savePlan={savePlan}
        />
      ))}
    </div>
  );
};
