import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { fetchExaSearch } from "../exa/fetchExaSearch";
import { getExaApiKey } from "../exa/getExaApiKey";
import { mapFirecrawlResultsToYoutubeVideos } from "./mapFirecrawlResultsToYoutubeVideos";
import { mergeUniqueLinkItems } from "./mergeUniqueLinkItems";

export const findYoutubeVideosWithExa = async (
  keyword: string,
): Promise<LinkItem[]> => {
  const apiKey = getExaApiKey();

  if (!apiKey) {
    return [];
  }

  const videos: LinkItem[] = [];
  const queries = [
    `${keyword} YouTube video`,
    `${keyword} tutorial YouTube`,
    `${keyword} explained YouTube`,
  ];

  for (const query of queries) {
    const results = await fetchExaSearch({
      apiKey,
      includeDomains: ["youtube.com", "youtu.be"],
      numResults: 5,
      query,
    }).catch(() => []);

    videos.push(...mapFirecrawlResultsToYoutubeVideos(results));

    if (mergeUniqueLinkItems(videos).length >= 3) {
      break;
    }
  }

  return mergeUniqueLinkItems(videos).slice(0, 3);
};
