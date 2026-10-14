import { detailPageKeywords } from "./constants/detailPageKeywords";
import { firecrawlLimits } from "./constants/firecrawlLimits";

export const pickDetailLinks = (links: string[], baseUrl: string) => {
  const base = new URL(baseUrl);
  const basePath = base.pathname.replace(/\/+$/, "");
  const scored = links
    .filter((link) => link !== baseUrl)
    .map((link) => {
      try {
        const url = new URL(link);
        const path = url.pathname.toLowerCase();
        const segments = path.split("/").filter(Boolean);
        let score = 0;

        if (path === basePath) return null;
        if (segments.length <= 2) score += 1;

        detailPageKeywords.forEach((keyword) => {
          if (
            path.includes(`/${keyword}`) ||
            path.includes(`${keyword}-`) ||
            path.includes(`-${keyword}`)
          ) {
            score += 2;
          }
        });

        return { link, score };
      } catch {
        return null;
      }
    })
    .filter((entry): entry is { link: string; score: number } => Boolean(entry));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, firecrawlLimits.maxDetailPages).map((entry) => entry.link);
};
