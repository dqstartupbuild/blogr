import { fetchFirecrawlSearch } from "../firecrawl/fetchFirecrawlSearch";
import { getFirecrawlApiKey } from "../firecrawl/getFirecrawlApiKey";
import { mapSearchResultsToSources } from "./mapSearchResultsToSources";

export const runBlogResearch = async (keyword: string) => {
  try {
    const apiKey = getFirecrawlApiKey();
    const results = await fetchFirecrawlSearch({
      apiKey,
      limit: 6,
      query: keyword,
    });

    return mapSearchResultsToSources(results);
  } catch {
    return [];
  }
};
