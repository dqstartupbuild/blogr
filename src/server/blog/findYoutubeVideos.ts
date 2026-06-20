import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { buildYouTubeSearchUrl } from "./buildYouTubeSearchUrl";
import type { YouTubeSearchResponse } from "./types/YouTubeSearchResponse";

export const findYoutubeVideos = async (keyword: string): Promise<LinkItem[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return [
      {
        title: `YouTube search for ${keyword}`,
        url: buildYouTubeSearchUrl(keyword),
      },
    ];
  }

  const params = new URLSearchParams({
    key: apiKey,
    maxResults: "3",
    part: "snippet",
    q: keyword,
    type: "video",
  });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as YouTubeSearchResponse;

  return (data.items || [])
    .map((item): LinkItem | null => {
      const videoId = item.id?.videoId;
      if (!videoId) return null;

      return {
        reason: item.snippet?.description || undefined,
        title: item.snippet?.title || "YouTube video",
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    })
    .filter((item): item is LinkItem => Boolean(item));
};
