import { FilteredBlogList } from "./FilteredBlogList";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import type { BlogItem } from "../types/BlogItem";
import type { DeleteBlog } from "../types/DeleteBlog";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogsPanelProps = {
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  blogs: BlogItem[];
  deleteBlog: DeleteBlog;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  previewBlog: (blogId: string) => void;
  selectedBlogId: string;
  setSelectedBlogId: (blogId: string) => void;
};

export const BlogsPanel = ({
  addTopic,
  blogs,
  deleteBlog,
  discoverBlogRefreshIdeas,
  previewBlog,
  selectedBlogId,
  setSelectedBlogId,
}: BlogsPanelProps) => {
  const savePlan: SaveDiscoveryPlan = (item) => addTopic(item.title, item.notes);

  return (
    <section className="space-y-6">
      <WorkspacePageHeader
        description="Review and manage the articles you have generated."
        title="Articles"
      />
      <FilteredBlogList
        blogs={blogs}
        deleteBlog={deleteBlog}
        discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
        previewBlog={previewBlog}
        savePlan={savePlan}
        selectedBlogId={selectedBlogId}
        setSelectedBlogId={setSelectedBlogId}
      />
    </section>
  );
};
