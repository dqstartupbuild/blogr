import type { BlogStatusFilter } from "../types/BlogStatusFilter";

export const blogStatusFilterOptions: {
  label: string;
  value: BlogStatusFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Unpublished", value: "unpublished" },
  { label: "Published", value: "published" },
];
