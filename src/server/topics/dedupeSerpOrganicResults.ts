import type { SerpOrganicResult } from "./types/SerpOrganicResult";

export const dedupeSerpOrganicResults = (items: SerpOrganicResult[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = (item.url || item.title).toLowerCase();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};
