import { fetchFirecrawlCrawlLinks } from "../firecrawl/fetchFirecrawlCrawlLinks";
import { fetchSitemapLinks } from "../firecrawl/fetchSitemapLinks";
import { normalizeSiteLink } from "../firecrawl/normalizeSiteLink";
import { readScrapeLinks } from "../firecrawl/readScrapeLinks";
import type { FirecrawlScrapeData } from "../firecrawl/types/FirecrawlScrapeData";

type CollectProductSiteLinkUrlsOptions = {
  apiKey: string;
  normalizedUrl: string;
  scrapeData?: FirecrawlScrapeData;
};

export const collectProductSiteLinkUrls = async ({
  apiKey,
  normalizedUrl,
  scrapeData,
}: CollectProductSiteLinkUrlsOptions) => {
  const sitemapLinks = await fetchSitemapLinks(normalizedUrl);
  const crawlLinks =
    sitemapLinks.length === 0
      ? await fetchFirecrawlCrawlLinks({ apiKey, url: normalizedUrl })
      : [];
  const baseHost = new URL(normalizedUrl).hostname.replace(/^www\./i, "");
  const siteLinkSet = new Set<string>();

  siteLinkSet.add(normalizeSiteLink(normalizedUrl, baseHost) || normalizedUrl);
  sitemapLinks.forEach((link) => siteLinkSet.add(link));
  crawlLinks.forEach((link) => siteLinkSet.add(link));
  readScrapeLinks(scrapeData).forEach((link) => {
    const normalized = normalizeSiteLink(link, baseHost);
    if (normalized) siteLinkSet.add(normalized);
  });

  return Array.from(siteLinkSet);
};
