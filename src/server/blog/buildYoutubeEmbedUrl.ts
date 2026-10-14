import { extractYoutubeVideoId } from "./extractYoutubeVideoId";

export const buildYoutubeEmbedUrl = (url: string) => {
  const videoId = extractYoutubeVideoId(url);

  if (!videoId) {
    return "";
  }

  return `https://www.youtube.com/embed/${videoId}`;
};
