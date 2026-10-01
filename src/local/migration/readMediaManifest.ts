import { readFile } from "node:fs/promises";
import { asRecord } from "./asRecord";
import type { MediaManifestEntry } from "./MediaManifestEntry";

export const readMediaManifest = async (path: string): Promise<MediaManifestEntry[]> => {
  const parsed: unknown = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("Media manifest must be an array.");
  if (parsed.length > 2000) throw new Error("Media manifest has too many entries.");
  return parsed.map((item, index) => {
    const record = asRecord(item, `Media manifest entry ${index + 1}`);
    if (typeof record.r2Key !== "string" || !record.r2Key || typeof record.file !== "string" || !record.file) throw new Error(`Media manifest entry ${index + 1} needs r2Key and file.`);
    if (record.sourceUrl !== undefined && typeof record.sourceUrl !== "string") throw new Error(`Media manifest entry ${index + 1} has an invalid sourceUrl.`);
    return { r2Key: record.r2Key, file: record.file, sourceUrl: record.sourceUrl };
  });
};
