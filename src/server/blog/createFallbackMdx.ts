import type { BlogImage } from "./types/BlogImage";
import type { StoredProduct } from "./types/StoredProduct";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { buildYoutubeEmbedMdx } from "./buildYoutubeEmbedMdx";

type CreateFallbackMdxOptions = {
  images: BlogImage[];
  internalLinks: LinkItem[];
  keyword: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
  sources: LinkItem[];
  title: string;
  youtubeVideos: LinkItem[];
};

export const createFallbackMdx = ({
  images,
  internalLinks,
  keyword,
  product,
  settings,
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
    .map(buildYoutubeEmbedMdx)
    .filter(Boolean)
    .join("\n\n");
  const usefulLinks = links ? `## Useful Links\n\n${links}` : "";
  const helpfulVideos = videos ? `## Helpful Videos\n\n${videos}` : "";
  const sourceSection = citations ? `## Sources\n\n${citations}` : "";
  const callToAction =
    settings.callToAction && product.websiteUrl
      ? `## Next Step\n\nSee how ${product.name || "the product"} can help at [${product.websiteUrl}](${product.websiteUrl}).`
      : "";
  const tableOfContents = settings.tableOfContents
    ? [
        "- [Direct Answer](#direct-answer)",
        links ? "- [Useful Links](#useful-links)" : "",
        videos ? "- [Helpful Videos](#helpful-videos)" : "",
        citations ? "- [Sources](#sources)" : "",
        callToAction ? "- [Next Step](#next-step)" : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  const tableOfContentsSection = tableOfContents
    ? `## In This Article\n\n${tableOfContents}`
    : "";

  return `---
title: "${title}"
description: "A simple guide to ${keyword}."
targetKeyword: "${keyword}"
featureImage: "${featureImage}"
---

# ${title}

The fastest way to make progress with ${keyword} is to keep the next step clear.

${featureImage ? `![${images[0]?.alt}](${featureImage})` : ""}

${tableOfContentsSection}

## Direct Answer

Start with the reader's real problem, explain the simple path forward, and connect each idea to something they can try today.

${usefulLinks}

${helpfulVideos}

${sourceSection}

${callToAction}
`;
};
