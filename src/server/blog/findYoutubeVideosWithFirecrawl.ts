import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { fetchFirecrawlSearch } from "../firecrawl/fetchFirecrawlSearch";
import { getFirecrawlApiKey } from "../firecrawl/getFirecrawlApiKey";
import { mapFirecrawlResultsToYoutubeVideos } from "./mapFirecrawlResultsToYoutubeVideos";

export const findYoutubeVideosWithFirecrawl = async (
  keyword: string,
): Promise<LinkItem[]> => {
  try {
    const apiKey = getFirecrawlApiKey();
    const results = await fetchFirecrawlSearch({
      apiKey,
      limit: 5,
      query: `site:youtube.com/watch ${keyword}`,
    });

    return mapFirecrawlResultsToYoutubeVideos(results).slice(0, 3);
  } catch {
    return [];
  }
};
