import type { ConvexRecord } from "./ConvexRecord";
import { stableLocalId } from "./stableLocalId";

export const resolveProductId = (record: ConvexRecord, products: ConvexRecord[]): string => {
  const sourceId = typeof record.productId === "string" ? record.productId : products.length === 1 ? products[0]._id : "";
  if (!products.some((product) => product._id === sourceId)) throw new Error(`Cannot resolve product for ${record._id}.`);
  return stableLocalId("products", sourceId);
};
