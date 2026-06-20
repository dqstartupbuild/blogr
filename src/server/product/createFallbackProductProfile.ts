import type { FirecrawlScrapeData } from "../firecrawl/types/FirecrawlScrapeData";
import type { ProductProfileDraft } from "./types/ProductProfileDraft";

type CreateFallbackProductProfileOptions = {
  colors: string[];
  homepageMarkdown: string;
  nicheHint: string;
  scrapeData?: FirecrawlScrapeData;
  websiteUrl: string;
};

export const createFallbackProductProfile = ({
  colors,
  homepageMarkdown,
  nicheHint,
  scrapeData,
  websiteUrl,
}: CreateFallbackProductProfileOptions): ProductProfileDraft => {
  const metadata = scrapeData?.metadata;
  const host = new URL(websiteUrl).hostname.replace(/^www\./i, "");
  const description =
    metadata?.description ||
    metadata?.ogDescription ||
    homepageMarkdown.replace(/\s+/g, " ").slice(0, 500);

  return {
    audience: "",
    colors,
    competitors: "",
    description,
    name: metadata?.ogTitle || metadata?.title || host,
    niche: nicheHint,
  };
};
