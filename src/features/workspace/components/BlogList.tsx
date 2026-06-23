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
    <div className="mt-4 grid gap-3">
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
