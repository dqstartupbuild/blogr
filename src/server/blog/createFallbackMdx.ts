import type { BlogImage } from "./types/BlogImage";
import type { LinkItem } from "@/features/workspace/types/LinkItem";

type CreateFallbackMdxOptions = {
  images: BlogImage[];
  internalLinks: LinkItem[];
  keyword: string;
  sources: LinkItem[];
  title: string;
  youtubeVideos: LinkItem[];
};

export const createFallbackMdx = ({
  images,
  internalLinks,
  keyword,
  sources,
  title,
  youtubeVideos,
}: CreateFallbackMdxOptions) => {
  const featureImage = images[0]?.url || "";
  const links = internalLinks
    .slice(0, 3)
    .map((link) => `- [${link.title}](${link.url})`)
    .join("\n");
  const citations = sources
    .slice(0, 4)
    .map((source) => `- [${source.title}](${source.url})`)
    .join("\n");
  const videos = youtubeVideos
    .slice(0, 2)
    .map((video) => `- [${video.title}](${video.url})`)
    .join("\n");

  return `---
title: "${title}"
description: "A simple guide to ${keyword}."
targetKeyword: "${keyword}"
featureImage: "${featureImage}"
---

# ${title}

The fastest way to make progress with ${keyword} is to keep the next step clear.

${featureImage ? `![${images[0]?.alt}](${featureImage})` : ""}

## Direct Answer

Start with the reader's real problem, explain the simple path forward, and connect each idea to something they can try today.

## Useful Links

${links}

## Helpful Videos

${videos}

## Sources

${citations}
`;
};
