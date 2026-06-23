import type { TopicStatusFilter } from "../types/TopicStatusFilter";

export const topicStatusFilterOptions: {
  label: string;
  value: TopicStatusFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Saved", value: "saved" },
  { label: "Writing", value: "writing" },
  { label: "Written", value: "written" },
  { label: "Failed", value: "failed" },
];
