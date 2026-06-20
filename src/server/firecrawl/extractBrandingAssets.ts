import type { FirecrawlScrapeData } from "./types/FirecrawlScrapeData";

export const extractBrandingAssets = (scrapeData?: FirecrawlScrapeData) => {
  const assets = new Set<string>();
  const add = (value?: string) => {
    if (value?.startsWith("http://") || value?.startsWith("https://")) {
      assets.add(value);
    }
  };

  add(scrapeData?.branding?.logo);
  add(scrapeData?.branding?.images?.logo);
  add(scrapeData?.branding?.images?.ogImage);
  add(scrapeData?.metadata?.ogImage);

  return Array.from(assets);
};
