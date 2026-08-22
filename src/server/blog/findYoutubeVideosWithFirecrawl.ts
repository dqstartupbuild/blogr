import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { fetchFirecrawlSearch } from "../firecrawl/fetchFirecrawlSearch";
import { getFirecrawlApiKey } from "../firecrawl/getFirecrawlApiKey";
import { mapFirecrawlResultsToYoutubeVideos } from "./mapFirecrawlResultsToYoutubeVideos";
import { mergeUniqueLinkItems } from "./mergeUniqueLinkItems";

export const findYoutubeVideosWithFirecrawl = async (
  keyword: string,
): Promise<LinkItem[]> => {
  try {
    const apiKey = getFirecrawlApiKey();
    const videos: LinkItem[] = [];
    const queries = [
      `site:youtube.com/watch ${keyword}`,
      `${keyword} YouTube video`,
      `${keyword} tutorial YouTube`,
    ];

    for (const query of queries) {
      const results = await fetchFirecrawlSearch({
        apiKey,
        limit: 5,
        query,
      }).catch(() => []);

      videos.push(...mapFirecrawlResultsToYoutubeVideos(results));

      if (mergeUniqueLinkItems(videos).length >= 3) {
        break;
      }
    }

    return mergeUniqueLinkItems(videos).slice(0, 3);
  } catch {
    return [];
  }
};
