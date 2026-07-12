import type { TopicStatusFilter } from "../types/TopicStatusFilter";

export const topicStatusFilterOptions: {
  label: string;
  value: TopicStatusFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Saved", value: "saved" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Writing", value: "writing" },
  { label: "Written", value: "written" },
  { label: "Published", value: "published" },
  { label: "Failed", value: "failed" },
];
