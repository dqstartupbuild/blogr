import { fetchPrimaryScrape } from "../firecrawl/fetchPrimaryScrape";
import { getFirecrawlApiKey } from "../firecrawl/getFirecrawlApiKey";
import { normalizeUrl } from "../firecrawl/normalizeUrl";
import { PublicError } from "../http/PublicError";
import { buildSiteLinkItems } from "./buildSiteLinkItems";
import { collectProductSiteLinkUrls } from "./collectProductSiteLinkUrls";

export const refreshProductSiteLinks = async (websiteUrl: string) => {
  const normalizedUrl = normalizeUrl(websiteUrl);
  if (!normalizedUrl) throw new PublicError("Use a real website URL.");

  const apiKey = getFirecrawlApiKey();
  const scrapeData = await fetchPrimaryScrape({ apiKey, url: normalizedUrl });
  const siteLinks = await collectProductSiteLinkUrls({
    apiKey,
    normalizedUrl,
    scrapeData,
  });

  return buildSiteLinkItems(siteLinks);
};
