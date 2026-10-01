import { readFile, stat } from "node:fs/promises";
import { detectRasterImageFormat } from "../../../shared/raster/detectRasterImageFormat";
import type { MediaManifestEntry } from "./MediaManifestEntry";
import { resolveManifestFile } from "./resolveManifestFile";
import { stableLocalId } from "./stableLocalId";

export type LocalMediaEntry = { r2Key: string; localUrl: string; name: string; bytes: Buffer };

export const buildMediaMap = async (keys: Set<string>, manifest: MediaManifestEntry[], manifestPath: string): Promise<LocalMediaEntry[]> => {
  if (keys.size > 1000) throw new Error("More than 1000 referenced images need migration.");
  const byKey = new Map<string, MediaManifestEntry>();
  for (const item of manifest) {
    const previous = byKey.get(item.r2Key);
    if (previous && previous.file !== item.file) throw new Error(`Conflicting media files for ${item.r2Key}.`);
    byKey.set(item.r2Key, item);
  }
  const result: LocalMediaEntry[] = [];
  let totalBytes = 0;
  for (const key of [...keys].sort()) {
    const entry = byKey.get(key);
    if (!entry) throw new Error(`Media manifest is missing ${key}.`);
    const source = await resolveManifestFile(manifestPath, entry.file);
    if ((await stat(source)).size > 20 * 1024 * 1024) throw new Error(`Image exceeds 20 MB: ${key}.`);
    const bytes = await readFile(source);
    if (bytes.length > 20 * 1024 * 1024) throw new Error(`Image exceeds 20 MB: ${key}.`);
    totalBytes += bytes.length;
    if (totalBytes > 512 * 1024 * 1024) throw new Error("Referenced images exceed 512 MB.");
    const format = detectRasterImageFormat(bytes);
    if (!format) throw new Error(`Unsupported image format: ${key}.`);
    const ext = format.contentType === "image/png" ? "png" : format.contentType === "image/webp" ? "webp" : format.contentType === "image/gif" ? "gif" : "jpg";
    const name = `${stableLocalId("r2", key)}.${ext}`;
    result.push({ r2Key: key, localUrl: `/api/local/media/${name}`, name, bytes });
  }
  return result;
};
