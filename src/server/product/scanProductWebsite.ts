import { buildRawProductContext } from "./buildRawProductContext";
import { buildSiteLinkItems } from "./buildSiteLinkItems";
import { collectProductSiteLinkUrls } from "./collectProductSiteLinkUrls";
import { extractProductProfile } from "./extractProductProfile";
import { extractBrandingAssets } from "../firecrawl/extractBrandingAssets";
import { extractBrandingColors } from "../firecrawl/extractBrandingColors";
import { extractHtmlColorCandidates } from "../firecrawl/extractHtmlColorCandidates";
import { fetchDetailMarkdown } from "../firecrawl/fetchDetailMarkdown";
import { fetchPrimaryScrape } from "../firecrawl/fetchPrimaryScrape";
import { getFirecrawlApiKey } from "../firecrawl/getFirecrawlApiKey";
import { mergeUniqueColors } from "../firecrawl/mergeUniqueColors";
import { normalizeUrl } from "../firecrawl/normalizeUrl";
import { pickDetailLinks } from "../firecrawl/pickDetailLinks";
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
  const siteLinks = await collectProductSiteLinkUrls({
    apiKey,
    normalizedUrl,
    scrapeData,
  });
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
