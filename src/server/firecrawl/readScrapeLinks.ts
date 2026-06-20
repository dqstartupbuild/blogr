import type { FirecrawlScrapeData } from "./types/FirecrawlScrapeData";

export const readScrapeLinks = (scrapeData?: FirecrawlScrapeData) => {
  const rawLinks = scrapeData?.links;

  if (Array.isArray(rawLinks)) {
    return rawLinks;
  }

  if (Array.isArray(rawLinks?.links)) {
    return rawLinks.links;
  }

  return [];
};
