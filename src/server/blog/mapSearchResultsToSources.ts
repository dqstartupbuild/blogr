import type { FirecrawlSearchResult } from "../firecrawl/types/FirecrawlSearchResult";
import type { ResearchSource } from "./types/ResearchSource";

export const mapSearchResultsToSources = (
  results: FirecrawlSearchResult[],
): ResearchSource[] => {
  return results
    .map((result) => ({
      description: result.description || "",
      markdown: (result.markdown || "").slice(0, 2400),
      title: result.title || result.url || "Source",
      url: result.url || "",
    }))
    .filter((source) => source.url);
};
