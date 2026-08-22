import { buildYoutubeWatchUrl } from "./buildYoutubeWatchUrl";
import { escapeMarkdownLabel } from "./escapeMarkdownLabel";
import { extractYoutubeVideoId } from "./extractYoutubeVideoId";
import { getHtmlAttributeValue } from "./getHtmlAttributeValue";

const iframePattern = /<iframe\b[\s\S]*?(?:<\/iframe>|\/>)/gi;

export const replaceYoutubeIframesWithMarkdownLinks = (markdown: string) => {
  return markdown.replace(iframePattern, (iframe) => {
    const src = getHtmlAttributeValue(iframe, "src");
    const videoId = extractYoutubeVideoId(src);

    if (!videoId) {
      return iframe;
    }

    const title = getHtmlAttributeValue(iframe, "title") || "YouTube video";

    return `[${escapeMarkdownLabel(title)}](${buildYoutubeWatchUrl(videoId)})`;
  });
};
