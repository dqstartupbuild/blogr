import { createHash } from "node:crypto";

export const stableLocalId = (table: string, oldId: string): string => {
  const hex = createHash("sha256").update(`blogr-convex-v1:${table}:${oldId}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
};
