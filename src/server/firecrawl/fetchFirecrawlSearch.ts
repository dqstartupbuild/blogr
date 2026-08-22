import { firecrawlBaseUrl } from "./constants/firecrawlBaseUrl";
import type { FirecrawlSearchResponse } from "./types/FirecrawlSearchResponse";

type FetchFirecrawlSearchOptions = {
  apiKey: string;
  limit?: number;
  query: string;
};

export const fetchFirecrawlSearch = async ({
  apiKey,
  limit = 5,
  query,
}: FetchFirecrawlSearchOptions) => {
  const response = await fetch(`${firecrawlBaseUrl}/search`, {
    body: JSON.stringify({
      query,
      limit,
      scrapeOptions: {
        formats: [{ type: "markdown" }],
        onlyMainContent: true,
      },
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const data = (await response.json()) as FirecrawlSearchResponse;

  if (!response.ok || data.success === false) {
    throw new Error(data.error || "Research search failed.");
  }

  return data.data || [];
};
