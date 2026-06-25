import { FilteredBlogList } from "./FilteredBlogList";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogsPanelProps = {
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  blogs: BlogItem[];
  deleteBlog: (blogId: string) => void | Promise<void>;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
};

export const BlogsPanel = ({
  addTopic,
  blogs,
  deleteBlog,
  discoverBlogRefreshIdeas,
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
        savePlan={savePlan}
      />
    </section>
  );
};
