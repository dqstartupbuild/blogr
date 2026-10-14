import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { buildYoutubeEmbedUrl } from "./buildYoutubeEmbedUrl";
import { escapeHtmlAttribute } from "./escapeHtmlAttribute";

export const buildYoutubeEmbedMdx = (video: LinkItem) => {
  const embedUrl = buildYoutubeEmbedUrl(video.url);

  if (!embedUrl) {
    return "";
  }

  return `<iframe
  width="100%"
  height="315"
  src="${embedUrl}"
  title="${escapeHtmlAttribute(video.title || "YouTube video")}"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>`;
};
