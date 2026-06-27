import { DashboardRecentArticles } from "./DashboardRecentArticles";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { DashboardTip } from "./DashboardTip";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import { countPublishedBlogs } from "../utils/countPublishedBlogs";
import { countWorkspaceImages } from "../utils/countWorkspaceImages";
import type { BlogItem } from "../types/BlogItem";
import type { TopicItem } from "../types/TopicItem";
import type { WorkspaceSummary } from "../types/WorkspaceSummary";

type DashboardPanelProps = {
  blogs: BlogItem[];
  summary?: WorkspaceSummary;
  topics: TopicItem[];
};

export const DashboardPanel = ({
  blogs,
  summary,
  topics,
}: DashboardPanelProps) => {
  const recentBlogs = summary?.recentBlogs || blogs.slice(0, 5);

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        description="A quick look at your blog workspace."
        title="Dashboard"
      />
      <DashboardStatsGrid
        blogCount={summary?.blogCount ?? blogs.length}
        imageCount={summary?.imageCount ?? countWorkspaceImages(blogs)}
        publishedBlogCount={
          summary?.publishedBlogCount ?? countPublishedBlogs(blogs)
        }
        topicCount={summary?.topicCount ?? topics.length}
      />
      <DashboardRecentArticles blogs={recentBlogs} />
      <DashboardTip />
    </div>
  );
};
