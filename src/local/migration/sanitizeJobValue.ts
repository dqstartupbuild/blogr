import { rewriteMediaString } from "./rewriteMediaString";
import type { LocalMediaEntry } from "./buildMediaMap";
import type { MediaManifestEntry } from "./MediaManifestEntry";
import { getOwnerR2Prefix } from "./getOwnerR2Prefix";
import { redactOwnerId } from "./redactOwnerId";

const sensitiveKey = /(?:secret|token|password|authorization|cookie|private.?key|api.?key|credential|user.?id|clerk.?id)/i;

export const sanitizeJobValue = (value: unknown, media: LocalMediaEntry[], manifest: MediaManifestEntry[], ownerId: string, depth = 0): unknown => {
  if (depth > 30) throw new Error("AI job data is nested too deeply.");
  if (typeof value === "string") return redactOwnerId(rewriteMediaString(value, media, manifest, true, getOwnerR2Prefix(ownerId)), ownerId);
  if (Array.isArray(value)) return value.map((item) => sanitizeJobValue(item, media, manifest, ownerId, depth + 1));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sensitiveKey.test(key) ? "[redacted]" : sanitizeJobValue(item, media, manifest, ownerId, depth + 1)]));
  return value;
};
