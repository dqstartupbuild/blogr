import { CheckCircle2, FileText, ImageIcon, ListChecks } from "lucide-react";
import { WorkspaceStatCard } from "./WorkspaceStatCard";

type DashboardStatsGridProps = {
  blogCount: number;
  imageCount: number;
  publishedBlogCount: number;
  topicCount: number;
};

export const DashboardStatsGrid = ({
  blogCount,
  imageCount,
  publishedBlogCount,
  topicCount,
}: DashboardStatsGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <WorkspaceStatCard
        icon={ListChecks}
        label="Topics"
        supportingText="Saved ideas"
        value={topicCount}
      />
      <WorkspaceStatCard
        icon={FileText}
        label="Articles"
        supportingText="Generated posts"
        value={blogCount}
      />
      <WorkspaceStatCard
        icon={CheckCircle2}
        label="Published"
        supportingText="Live posts"
        value={publishedBlogCount}
      />
      <WorkspaceStatCard
        icon={ImageIcon}
        label="Images"
        supportingText="Ready for exports"
        value={imageCount}
      />
    </div>
  );
};
