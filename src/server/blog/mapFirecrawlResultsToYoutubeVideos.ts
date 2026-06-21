import type { LinkItem } from "@/features/workspace/types/LinkItem";
import type { FirecrawlSearchResult } from "../firecrawl/types/FirecrawlSearchResult";
import { buildYoutubeVideoUrl } from "./buildYoutubeVideoUrl";
import { extractYoutubeVideoId } from "./extractYoutubeVideoId";

export const mapFirecrawlResultsToYoutubeVideos = (
  results: FirecrawlSearchResult[],
) => {
  const seenVideoIds = new Set<string>();

  return results
    .map((result): LinkItem | null => {
      const videoId = result.url ? extractYoutubeVideoId(result.url) : "";

      if (!videoId || seenVideoIds.has(videoId)) {
        return null;
      }

      seenVideoIds.add(videoId);

      return {
        reason: result.description || undefined,
        title: result.title || "YouTube video",
        url: buildYoutubeVideoUrl(videoId),
      };
    })
    .filter((item): item is LinkItem => Boolean(item));
};
