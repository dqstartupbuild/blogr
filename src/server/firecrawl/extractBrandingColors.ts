import { mergeUniqueColors } from "./mergeUniqueColors";
import type { FirecrawlScrapeData } from "./types/FirecrawlScrapeData";

export const extractBrandingColors = (scrapeData?: FirecrawlScrapeData) => {
  if (!scrapeData?.branding?.colors) return [];

  return mergeUniqueColors(
    Object.values(scrapeData.branding.colors).filter(
      (value): value is string => typeof value === "string",
    ),
  );
};
