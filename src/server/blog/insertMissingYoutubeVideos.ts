import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { buildYoutubeEmbedMdx } from "./buildYoutubeEmbedMdx";
import { mdxIncludesYoutubeVideo } from "./mdxIncludesYoutubeVideo";

type InsertMissingYoutubeVideosOptions = {
  mdx: string;
  youtubeVideos: LinkItem[];
};

export const insertMissingYoutubeVideos = ({
  mdx,
  youtubeVideos,
}: InsertMissingYoutubeVideosOptions) => {
  const missingVideos = youtubeVideos.filter(
    (video) => !mdxIncludesYoutubeVideo(mdx, video.url),
  );

  if (missingVideos.length === 0) {
    return mdx;
  }

  const videoEmbeds = missingVideos
    .slice(0, 3)
    .map(buildYoutubeEmbedMdx)
    .filter(Boolean)
    .join("\n\n");

  if (!videoEmbeds) {
    return mdx;
  }

  return `${mdx.trimEnd()}\n\n## Helpful Videos\n\n${videoEmbeds}\n`;
};
