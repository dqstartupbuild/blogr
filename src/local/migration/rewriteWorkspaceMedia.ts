import { localStateSchema } from "../domain/localStateSchema";
import type { LocalState } from "../domain/LocalState";
import type { LocalMediaEntry } from "./buildMediaMap";
import type { MediaManifestEntry } from "./MediaManifestEntry";
import { rewriteMediaString } from "./rewriteMediaString";

export const rewriteWorkspaceMedia = (state: LocalState, media: LocalMediaEntry[], manifest: MediaManifestEntry[]): LocalState => {
  const walk = (value: unknown): unknown => {
    if (typeof value === "string") return rewriteMediaString(value, media, manifest);
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item)]));
    return value;
  };
  const rewritten = walk(state) as LocalState;
  rewritten.products = rewritten.products.map((product) => ({ ...product, assetKeys: [], productImageKeys: [] }));
  return localStateSchema.parse(rewritten) as LocalState;
};
