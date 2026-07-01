import type { TopicSourceType } from "../types/TopicSourceType";

const topicSourceLabels: Record<TopicSourceType, string> = {
  aeo: "AI answer",
  cluster: "Cluster",
  comparison: "Comparison",
  difficulty: "Difficulty",
  discovery: "Topic idea",
  gap: "Gap",
  manual: "Manual",
  question: "Question",
  refresh: "Refresh",
};

type TopicSourceBadgeProps = {
  sourceType?: TopicSourceType;
};

export const TopicSourceBadge = ({ sourceType }: TopicSourceBadgeProps) => {
  const label = topicSourceLabels[sourceType || "manual"];

  return (
    <span className="inline-flex h-7 items-center rounded-md border border-black/10 bg-black/[0.03] px-2 text-xs font-semibold text-black/60">
      {label}
    </span>
  );
};
