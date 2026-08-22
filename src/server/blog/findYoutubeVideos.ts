import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { findYoutubeVideosWithApi } from "./findYoutubeVideosWithApi";
import { findYoutubeVideosWithExa } from "./findYoutubeVideosWithExa";
import { findYoutubeVideosWithFirecrawl } from "./findYoutubeVideosWithFirecrawl";

export const findYoutubeVideos = async (keyword: string): Promise<LinkItem[]> => {
  const apiResults = await findYoutubeVideosWithApi(keyword);

  if (apiResults.length > 0) {
    return apiResults;
  }

  const exaResults = await findYoutubeVideosWithExa(keyword);

  if (exaResults.length > 0) {
    return exaResults;
  }

  return await findYoutubeVideosWithFirecrawl(keyword);
};
