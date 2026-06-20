export type TopicItem = {
  id: string;
  keyword: string;
  notes?: string;
  status: "saved" | "writing" | "written" | "failed";
  blogId?: string;
};
