import { firecrawlBaseUrl } from "./constants/firecrawlBaseUrl";
import type { FirecrawlScrapeResponse } from "./types/FirecrawlScrapeResponse";

type FetchFirecrawlScrapeOptions = {
  apiKey: string;
  formats: string[];
  url: string;
};

export const fetchFirecrawlScrape = async ({
  apiKey,
  formats,
  url,
}: FetchFirecrawlScrapeOptions) => {
  const response = await fetch(`${firecrawlBaseUrl}/scrape`, {
    body: JSON.stringify({
      url,
      formats,
      onlyMainContent: true,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = (await response.json()) as FirecrawlScrapeResponse;

  if (!response.ok || data.success === false) {
    throw new Error(data.error || "Firecrawl scrape failed.");
  }

  return data.data;
};
