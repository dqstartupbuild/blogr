import { getApifyToken } from "./getApifyToken";
import type { GoogleSearchScraperRecord } from "./types/GoogleSearchScraperRecord";

type RunGoogleSearchScraperOptions = {
  includeAiMode?: boolean;
  maxQueries?: number;
  queries: string[];
  timeoutMs?: number;
};

export const runGoogleSearchScraper = async ({
  includeAiMode = false,
  maxQueries = 6,
  queries,
  timeoutMs = 240000,
}: RunGoogleSearchScraperOptions): Promise<GoogleSearchScraperRecord[]> => {
  const cleanQueries = Array.from(
    new Set(queries.map((query) => query.trim()).filter(Boolean)),
  ).slice(0, Math.max(1, maxQueries));

  if (cleanQueries.length === 0) {
    throw new Error("Add a product niche or seed keyword first.");
  }

  const url = new URL(
    "https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items",
  );
  url.searchParams.set("token", getApifyToken());

  const response = await fetch(url, {
    body: JSON.stringify({
      aiModeSearch: {
        enableAiMode: includeAiMode,
      },
      chatGptSearch: {
        enableChatGpt: false,
      },
      copilotSearch: {
        enableCopilot: false,
      },
      countryCode: "us",
      geminiSearch: {
        enableGemini: false,
      },
      includeIcons: false,
      includeUnfilteredResults: false,
      languageCode: "en",
      maxConcurrency: 5,
      maxPagesPerQuery: 1,
      maximumLeadsEnrichmentRecords: 0,
      mobileResults: false,
      perplexitySearch: {
        enablePerplexity: false,
        returnImages: false,
        returnRelatedQuestions: false,
      },
      queries: cleanQueries.join("\n"),
      saveHtml: false,
      saveHtmlToKeyValueStore: false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Google search scraping failed.");
  }

  const data = (await response.json()) as unknown;

  if (Array.isArray(data)) {
    return data as GoogleSearchScraperRecord[];
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { items?: unknown }).items)
  ) {
    return (data as { items: GoogleSearchScraperRecord[] }).items;
  }

  return [];
};
