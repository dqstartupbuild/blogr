import type { LocalState } from "../domain/LocalState";
import type { ConvexRecord } from "./ConvexRecord";
import { resolveProductId } from "./resolveProductId";
import { sourceNumber, sourceString } from "./sourceValue";
import { stableLocalId } from "./stableLocalId";

export const mapConvexTopic = (source: ConvexRecord, products: ConvexRecord[]): LocalState["topics"][number] => ({
  id: stableLocalId("topics", source._id), productId: resolveProductId(source, products),
  keyword: sourceString(source, "keyword"), status: source.status as LocalState["topics"][number]["status"],
  blogId: typeof source.blogId === "string" ? stableLocalId("blogs", source.blogId) : undefined,
  canonicalKeyword: typeof source.canonicalKeyword === "string" ? source.canonicalKeyword : undefined,
  intentKey: typeof source.intentKey === "string" ? source.intentKey : undefined,
  notes: typeof source.notes === "string" ? source.notes : undefined,
  scheduledDate: typeof source.scheduledDate === "string" ? source.scheduledDate : undefined,
  sourceType: source.sourceType as LocalState["topics"][number]["sourceType"],
  createdAt: sourceNumber(source, "createdAt", sourceNumber(source, "_creationTime")),
  updatedAt: sourceNumber(source, "updatedAt", sourceNumber(source, "_creationTime")),
  lastError: typeof source.lastError === "string" ? source.lastError : undefined,
});
