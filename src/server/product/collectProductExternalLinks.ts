import { extractMarkdownLinkUrls } from "./extractMarkdownLinkUrls";
import { getProductExternalLinkLabel } from "./getProductExternalLinkLabel";
import { isProductMarketplaceUrl } from "./isProductMarketplaceUrl";
import { readScrapeLinks } from "../firecrawl/readScrapeLinks";
import type { DetailPage } from "../firecrawl/types/DetailPage";
import type { FirecrawlScrapeData } from "../firecrawl/types/FirecrawlScrapeData";

type CollectProductExternalLinksOptions = {
  detailPages: DetailPage[];
  homepageMarkdown: string;
  scrapeData?: FirecrawlScrapeData;
};

export const collectProductExternalLinks = ({
  detailPages,
  homepageMarkdown,
  scrapeData,
}: CollectProductExternalLinksOptions) => {
  const candidates = [
    ...readScrapeLinks(scrapeData),
    ...extractMarkdownLinkUrls(homepageMarkdown),
    ...detailPages.flatMap((page) => extractMarkdownLinkUrls(page.markdown)),
  ];

  return Array.from(new Set(candidates.filter(isProductMarketplaceUrl))).map(
    (url) => ({
      label: getProductExternalLinkLabel(url),
      url,
    }),
  );
};
