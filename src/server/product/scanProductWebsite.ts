import { buildRawProductContext } from "./buildRawProductContext";
import { buildSiteLinkItems } from "./buildSiteLinkItems";
import { extractProductProfile } from "./extractProductProfile";
import { extractBrandingAssets } from "../firecrawl/extractBrandingAssets";
import { extractBrandingColors } from "../firecrawl/extractBrandingColors";
import { extractHtmlColorCandidates } from "../firecrawl/extractHtmlColorCandidates";
import { fetchDetailMarkdown } from "../firecrawl/fetchDetailMarkdown";
import { fetchFirecrawlCrawlLinks } from "../firecrawl/fetchFirecrawlCrawlLinks";
import { fetchPrimaryScrape } from "../firecrawl/fetchPrimaryScrape";
import { fetchSitemapLinks } from "../firecrawl/fetchSitemapLinks";
import { getFirecrawlApiKey } from "../firecrawl/getFirecrawlApiKey";
import { mergeUniqueColors } from "../firecrawl/mergeUniqueColors";
import { normalizeSiteLink } from "../firecrawl/normalizeSiteLink";
import { normalizeUrl } from "../firecrawl/normalizeUrl";
import { pickDetailLinks } from "../firecrawl/pickDetailLinks";
import { readScrapeLinks } from "../firecrawl/readScrapeLinks";
import type { ProductScanResult } from "./types/ProductScanResult";

type ScanProductWebsiteOptions = {
  nicheHint?: string;
  websiteUrl: string;
};

export const scanProductWebsite = async ({
  nicheHint = "",
  websiteUrl,
}: ScanProductWebsiteOptions): Promise<ProductScanResult> => {
  const normalizedUrl = normalizeUrl(websiteUrl);
  if (!normalizedUrl) throw new Error("Use a real website URL.");

  const apiKey = getFirecrawlApiKey();
  const scrapeData = await fetchPrimaryScrape({ apiKey, url: normalizedUrl });
  const homepageMarkdown = scrapeData?.markdown || "";
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

  const siteLinks = Array.from(siteLinkSet);
  const detailLinks = pickDetailLinks(siteLinks, normalizedUrl);
  const detailPages = await fetchDetailMarkdown({ apiKey, links: detailLinks });
  const colors = mergeUniqueColors(
    extractHtmlColorCandidates(scrapeData?.rawHtml, scrapeData?.html),
    extractBrandingColors(scrapeData),
  );
  const profile = await extractProductProfile({
    colors,
    detailPages,
    homepageMarkdown,
    nicheHint,
    scrapeData,
    websiteUrl: normalizedUrl,
  });
  const rawContext = buildRawProductContext({
    detailPages,
    homepageMarkdown,
    siteLinks,
    websiteUrl: normalizedUrl,
  });

  return {
    assets: extractBrandingAssets(scrapeData),
    audience: profile.audience || "",
    colors: mergeUniqueColors(profile.colors || [], colors),
    competitors: profile.competitors || "",
    description: profile.description || "",
    name: profile.name || new URL(normalizedUrl).hostname.replace(/^www\./i, ""),
    niche: profile.niche || nicheHint,
    productImages: scrapeData?.screenshot ? [scrapeData.screenshot] : [],
    rawContext,
    siteLinks: buildSiteLinkItems(siteLinks),
    websiteUrl: normalizedUrl,
  };
};
