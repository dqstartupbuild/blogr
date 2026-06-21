import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { findYoutubeVideosWithApi } from "./findYoutubeVideosWithApi";
import { findYoutubeVideosWithFirecrawl } from "./findYoutubeVideosWithFirecrawl";

export const findYoutubeVideos = async (keyword: string): Promise<LinkItem[]> => {
  const apiResults = await findYoutubeVideosWithApi(keyword);

  if (apiResults.length > 0) {
    return apiResults;
  }

  return await findYoutubeVideosWithFirecrawl(keyword);
};
