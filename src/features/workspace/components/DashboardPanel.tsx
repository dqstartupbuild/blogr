import { DashboardRecentArticles } from "./DashboardRecentArticles";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { DashboardTip } from "./DashboardTip";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import type { BlogItem } from "../types/BlogItem";
import type { TopicItem } from "../types/TopicItem";

type DashboardPanelProps = {
  blogs: BlogItem[];
  topics: TopicItem[];
};

export const DashboardPanel = ({ blogs, topics }: DashboardPanelProps) => {
  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        description="A quick look at your blog workspace."
        title="Dashboard"
      />
      <DashboardStatsGrid blogs={blogs} topics={topics} />
      <DashboardRecentArticles blogs={blogs} />
      <DashboardTip />
    </div>
  );
};
