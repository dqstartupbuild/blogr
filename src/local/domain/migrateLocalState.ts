import { z } from "zod";
import { localStateSchema } from "./localStateSchema";
import type { LocalState } from "./LocalState";
const versionZeroSchema = z.object({ schemaVersion: z.literal(0), revision: z.number().int().nonnegative(), activeProductId: z.string().nullable(), products: z.array(z.unknown()), topics: z.array(z.unknown()), blogs: z.array(z.unknown()) });
export const migrateLocalState = (source: unknown): LocalState => {
  if (typeof source === "object" && source !== null && "schemaVersion" in source && source.schemaVersion === 0) {
    const old = versionZeroSchema.parse(source);
    return localStateSchema.parse({ ...old, schemaVersion: 1, blogVersions: [] }) as unknown as LocalState;
  }
  return localStateSchema.parse(source) as unknown as LocalState;
};
