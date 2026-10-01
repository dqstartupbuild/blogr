import type { LocalState } from "../domain/LocalState";
import type { ConvexRecord } from "./ConvexRecord";
import { mapConvexBlog } from "./mapConvexBlog";
import { sourceNumber } from "./sourceValue";
import { stableLocalId } from "./stableLocalId";

export const mapConvexVersion = (source: ConvexRecord, products: ConvexRecord[]): LocalState["blogVersions"][number] => {
  if (typeof source.blogId !== "string") throw new Error(`Version ${source._id} lacks blogId.`);
  const blogFields = mapConvexBlog({ ...source, createdAt: source.blogCreatedAt, updatedAt: source.blogUpdatedAt }, products);
  return {
    ...blogFields, id: stableLocalId("blogVersions", source._id), blogId: stableLocalId("blogs", source.blogId),
    versionNumber: sourceNumber(source, "versionNumber"), archivedAt: sourceNumber(source, "archivedAt"),
  };
};
