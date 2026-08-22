import { fetchFirecrawlScrape } from "./fetchFirecrawlScrape";

type FetchPrimaryScrapeOptions = {
  apiKey: string;
  url: string;
};

export const fetchPrimaryScrape = async ({
  apiKey,
  url,
}: FetchPrimaryScrapeOptions) => {
  try {
    return await fetchFirecrawlScrape({
      apiKey,
      formats: ["markdown", "html", "rawHtml", "branding", "links", "screenshot"],
      url,
    });
  } catch {
    return await fetchFirecrawlScrape({
      apiKey,
      formats: ["markdown", "branding", "links", "screenshot"],
      url,
    });
  }
};
