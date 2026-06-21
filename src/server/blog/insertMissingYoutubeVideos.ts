import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { buildMarkdownLink } from "./buildMarkdownLink";

type InsertMissingYoutubeVideosOptions = {
  mdx: string;
  youtubeVideos: LinkItem[];
};

export const insertMissingYoutubeVideos = ({
  mdx,
  youtubeVideos,
}: InsertMissingYoutubeVideosOptions) => {
  const missingVideos = youtubeVideos.filter((video) => !mdx.includes(video.url));

  if (missingVideos.length === 0) {
    return mdx;
  }

  const videoLinks = missingVideos
    .slice(0, 3)
    .map((video) => `- ${buildMarkdownLink(video)}`)
    .join("\n");

  return `${mdx.trimEnd()}\n\n## Helpful Videos\n\n${videoLinks}\n`;
};
