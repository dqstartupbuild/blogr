import type { LocalState } from "../domain/LocalState";
import type { ConvexRecord } from "./ConvexRecord";
import { resolveProductId } from "./resolveProductId";
import { sourceArray, sourceNumber, sourceString } from "./sourceValue";
import { stableLocalId } from "./stableLocalId";

export const mapConvexBlog = (source: ConvexRecord, products: ConvexRecord[]): LocalState["blogs"][number] => ({
  id: stableLocalId("blogs", source._id), productId: resolveProductId(source, products),
  topicId: typeof source.topicId === "string" ? stableLocalId("topics", source.topicId) : undefined,
  keyword: sourceString(source, "keyword"), title: sourceString(source, "title"),
  seoTitle: sourceString(source, "seoTitle", sourceString(source, "title")), slug: sourceString(source, "slug"),
  excerpt: sourceString(source, "excerpt"), mdx: sourceString(source, "mdx"),
  status: source.status as LocalState["blogs"][number]["status"],
  createdAt: sourceNumber(source, "createdAt", sourceNumber(source, "_creationTime")),
  updatedAt: sourceNumber(source, "updatedAt", sourceNumber(source, "_creationTime")),
  publishedAt: typeof source.publishedAt === "number" ? source.publishedAt : undefined,
  featureImageUrl: typeof source.featureImageUrl === "string" ? source.featureImageUrl : undefined,
  images: sourceArray(source, "images") as LocalState["blogs"][number]["images"],
  internalLinks: sourceArray(source, "internalLinks") as LocalState["blogs"][number]["internalLinks"],
  youtubeVideos: sourceArray(source, "youtubeVideos") as LocalState["blogs"][number]["youtubeVideos"],
  sources: sourceArray(source, "sources") as LocalState["blogs"][number]["sources"],
  tags: sourceArray(source, "tags") as string[],
});
