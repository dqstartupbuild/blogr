import { extractYoutubeVideoId } from "./extractYoutubeVideoId";

export const mdxIncludesYoutubeVideo = (mdx: string, url: string) => {
  const videoId = extractYoutubeVideoId(url);

  if (!videoId) {
    return false;
  }

  return (
    mdx.includes(`youtube.com/embed/${videoId}`) ||
    mdx.includes(`youtube-nocookie.com/embed/${videoId}`)
  );
};
