import type { Id } from "../_generated/dataModel";

export type BlogReadModelSource = {
  _id: Id<"blogs">;
  userId: string;
  productId?: Id<"products">;
  topicId?: Id<"topics">;
  keyword: string;
  searchText?: string;
  title: string;
  seoTitle?: string;
  slug: string;
  excerpt: string;
  status: "draft" | "ready" | "failed" | "published";
  mdx: string;
  featureImageUrl?: string;
  images: {
    url: string;
  }[];
  tags?: string[];
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
};
