import type { BlogImage } from "./types/BlogImage";
import type { StoredProduct } from "./types/StoredProduct";
import type { AssociateBrandLink } from "@/features/workspace/types/AssociateBrandLink";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { buildYoutubeEmbedMdx } from "./buildYoutubeEmbedMdx";

type CreateFallbackMdxOptions = {
  associateBrandLinks: AssociateBrandLink[];
  description: string;
  images: BlogImage[];
  internalLinks: LinkItem[];
  keyword: string;
  product: StoredProduct;
  seoTitle: string;
  settings: BlogGenerationSettings;
  sources: LinkItem[];
  title: string;
  youtubeVideos: LinkItem[];
};

export const createFallbackMdx = ({
  associateBrandLinks,
  description,
  images,
  internalLinks,
  keyword,
  product,
  seoTitle,
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
  const associateLinks = associateBrandLinks
    .slice(0, 5)
    .map((link) => {
      const label = link.title || link.url;
      const description = link.description ? `, ${link.description}` : "";

      return `- [${label}](${link.url})${description}`;
    })
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
  const helpfulBrandLinks = associateLinks
    ? `## Helpful Brand Links\n\n${associateLinks}`
    : "";
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
        associateLinks ? "- [Helpful Brand Links](#helpful-brand-links)" : "",
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
seoTitle: "${seoTitle}"
description: "${description}"
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

${helpfulBrandLinks}

${helpfulVideos}

${sourceSection}

${callToAction}
`;
};
