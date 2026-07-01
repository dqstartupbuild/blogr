import type { Id } from "../_generated/dataModel";

export type TopicReadModelSource = {
  _id: Id<"topics">;
  userId: string;
  productId?: Id<"products">;
  keyword: string;
  searchText?: string;
  canonicalKeyword?: string;
  intentKey?: string;
  notes?: string;
  scheduledDate?: string;
  sourceType?:
    | "manual"
    | "discovery"
    | "gap"
    | "comparison"
    | "question"
    | "cluster"
    | "refresh"
    | "aeo"
    | "difficulty";
  status: "saved" | "scheduled" | "writing" | "written" | "failed";
  blogId?: Id<"blogs">;
  createdAt: number;
  updatedAt: number;
};
