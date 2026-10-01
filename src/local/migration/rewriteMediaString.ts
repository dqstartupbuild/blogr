import type { LocalMediaEntry } from "./buildMediaMap";
import type { MediaManifestEntry } from "./MediaManifestEntry";

export const rewriteMediaString = (text: string, media: LocalMediaEntry[], manifest: MediaManifestEntry[], archiveOnly = false, ownerPrefix = ""): string => {
  const byKey = new Map(media.map((item) => [item.r2Key, item.localUrl]));
  const byUrl = new Map(manifest.filter((item) => item.sourceUrl && byKey.has(item.r2Key)).map((item) => [item.sourceUrl!, byKey.get(item.r2Key)!]));
  const archiveKey = (key: string) => `r2-key:${ownerPrefix && key.startsWith(ownerPrefix) ? key.slice(ownerPrefix.length) : key}`;
  const rewrite = (url: string) => {
    const exact = byUrl.get(url);
    if (exact) return exact;
    try {
      const parsed = new URL(url);
      const nested = parsed.searchParams.get("url");
      if (nested?.startsWith("http")) {
        const nestedUrl = new URL(nested);
        if (nestedUrl.hostname.endsWith(".r2.cloudflarestorage.com")) {
          const nestedKey = decodeURIComponent(nestedUrl.pathname.replace(/^\//, ""));
          const nestedLocal = byKey.get(nestedKey);
          if (nestedLocal) return nestedLocal;
          return archiveKey(nestedKey);
        }
      }
      const key = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
      const local = byKey.get(key);
      if (local) return local;
      if (parsed.hostname.endsWith(".r2.cloudflarestorage.com")) {
        if (archiveOnly) return archiveKey(key);
        throw new Error(`An R2 image has no downloaded media entry: ${key}.`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("An R2 image")) throw error;
    }
    return url;
  };
  if (/^https?:\/\//.test(text)) return rewrite(text);
  return text.replace(/https?:\/\/[^\s"'<>()[\]]+/g, rewrite);
};
