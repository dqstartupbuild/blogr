import { localStateSchema } from "../domain/localStateSchema";
import type { LocalState } from "../domain/LocalState";
import type { ConvexTables } from "./ConvexRecord";
import { mapConvexProduct } from "./mapConvexProduct";
import { mapConvexTopic } from "./mapConvexTopic";
import { mapConvexBlog } from "./mapConvexBlog";
import { mapConvexVersion } from "./mapConvexVersion";
import { stableLocalId } from "./stableLocalId";

export const mapConvexWorkspace = (tables: ConvexTables, ownerId: string): LocalState => {
  if (!ownerId.startsWith("user_")) throw new Error("Pass a verified Clerk owner ID with --owner-id.");
  const owned = Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.filter((row) => row.userId === ownerId)])) as ConvexTables;
  if (owned.products.length === 0) throw new Error("No products belong to the verified owner.");
  const selected = [...owned.workspaceSelections].sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0];
  const selectedId = typeof selected?.productId === "string" && owned.products.some((product) => product._id === selected.productId)
    ? selected.productId : [...owned.products].sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0]._id;
  const state = {
    schemaVersion: 1, revision: 0, activeProductId: stableLocalId("products", selectedId),
    products: owned.products.map(mapConvexProduct), topics: owned.topics.map((row) => mapConvexTopic(row, owned.products)),
    blogs: owned.blogs.map((row) => mapConvexBlog(row, owned.products)),
    blogVersions: owned.blogVersions.map((row) => mapConvexVersion(row, owned.products)),
  } as const;
  return localStateSchema.parse(state) as LocalState;
};
