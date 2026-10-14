import { buildRawProductContext } from "./buildRawProductContext";
import { buildSiteLinkItems } from "./buildSiteLinkItems";
import { collectProductSiteLinkUrls } from "./collectProductSiteLinkUrls";
import { collectProductExternalLinks } from "./collectProductExternalLinks";
import { extractProductProfile } from "./extractProductProfile";
import { isProductMarketplaceUrl } from "./isProductMarketplaceUrl";
import { extractBrandingAssets } from "../firecrawl/extractBrandingAssets";
import { extractBrandingColors } from "../firecrawl/extractBrandingColors";
import { extractHtmlColorCandidates } from "../firecrawl/extractHtmlColorCandidates";
import { fetchDetailMarkdown } from "../firecrawl/fetchDetailMarkdown";
import { fetchPrimaryScrape } from "../firecrawl/fetchPrimaryScrape";
import { getFirecrawlApiKey } from "../firecrawl/getFirecrawlApiKey";
import { mergeUniqueColors } from "../firecrawl/mergeUniqueColors";
import { normalizeUrl } from "../firecrawl/normalizeUrl";
import { pickDetailLinks } from "../firecrawl/pickDetailLinks";
import { PublicError } from "../http/PublicError";
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
  if (!normalizedUrl) throw new PublicError("Use a real website URL.");

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
  const detectedExternalLinks = collectProductExternalLinks({
    detailPages,
    homepageMarkdown,
    scrapeData,
  });
  const externalLinks = Array.from(
    new Map(
      [
        ...detectedExternalLinks,
        ...(profile.externalLinks || []).filter((link) =>
          isProductMarketplaceUrl(link.url),
        ),
      ].map((link) => [link.url, link]),
    ).values(),
  );
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
    externalLinks,
    features: profile.features || [],
    name: profile.name || new URL(normalizedUrl).hostname.replace(/^www\./i, ""),
    niche: profile.niche || nicheHint,
    offers: profile.offers || [],
    pricing: profile.pricing || [],
    productImages: scrapeData?.screenshot ? [scrapeData.screenshot] : [],
    rawContext,
    siteLinks: buildSiteLinkItems(siteLinks),
    websiteUrl: normalizedUrl,
  };
};
