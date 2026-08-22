import { buildYoutubeEmbedMdx } from "./buildYoutubeEmbedMdx";
import { buildYoutubeEmbedUrl } from "./buildYoutubeEmbedUrl";

const youtubeMarkdownLinkLinePattern =
  /(^|\n)[ \t]*(?:[-*+]\s+|\d+\.\s+)?\[([^\]\n]+)\]\((https?:\/\/(?:www\.)?(?:youtube\.com|m\.youtube\.com|music\.youtube\.com|youtube-nocookie\.com|youtu\.be)[^)]+)\)[ \t]*(?=\n|$)/gim;

export const normalizeYoutubeLinksInMdx = (mdx: string) => {
  return mdx.replace(
    youtubeMarkdownLinkLinePattern,
    (match, lineStart: string, title: string, url: string) => {
      if (!buildYoutubeEmbedUrl(url)) {
        return match;
      }

      return `${lineStart}${buildYoutubeEmbedMdx({ title, url })}`;
    },
  );
};
