import { CheckCircle2, FileText, ImageIcon, ListChecks } from "lucide-react";
import { WorkspaceStatCard } from "./WorkspaceStatCard";
import { countPublishedBlogs } from "../utils/countPublishedBlogs";
import { countWorkspaceImages } from "../utils/countWorkspaceImages";
import type { BlogItem } from "../types/BlogItem";
import type { TopicItem } from "../types/TopicItem";

type DashboardStatsGridProps = {
  blogs: BlogItem[];
  topics: TopicItem[];
};

export const DashboardStatsGrid = ({
  blogs,
  topics,
}: DashboardStatsGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <WorkspaceStatCard
        icon={ListChecks}
        label="Topics"
        supportingText="Saved ideas"
        value={topics.length}
      />
      <WorkspaceStatCard
        icon={FileText}
        label="Articles"
        supportingText="Generated posts"
        value={blogs.length}
      />
      <WorkspaceStatCard
        icon={CheckCircle2}
        label="Published"
        supportingText="Live posts"
        value={countPublishedBlogs(blogs)}
      />
      <WorkspaceStatCard
        icon={ImageIcon}
        label="Images"
        supportingText="Ready for exports"
        value={countWorkspaceImages(blogs)}
      />
    </div>
  );
};
