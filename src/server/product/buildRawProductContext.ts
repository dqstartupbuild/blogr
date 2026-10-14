import { firecrawlLimits } from "../firecrawl/constants/firecrawlLimits";
import type { DetailPage } from "../firecrawl/types/DetailPage";

type BuildRawProductContextOptions = {
  detailPages: DetailPage[];
  homepageMarkdown: string;
  siteLinks: string[];
  websiteUrl: string;
};

export const buildRawProductContext = ({
  detailPages,
  homepageMarkdown,
  siteLinks,
  websiteUrl,
}: BuildRawProductContextOptions) => {
  const sections = [
    `Homepage URL: ${websiteUrl}`,
    homepageMarkdown
      ? `Homepage markdown:\n${homepageMarkdown.slice(0, firecrawlLimits.maxBrandMarkdown)}`
      : "",
    ...detailPages.map((page) => `Page URL: ${page.url}\n${page.markdown}`),
    siteLinks.length > 0
      ? `Discovered links:\n${siteLinks.slice(0, 120).join("\n")}`
      : "",
  ].filter(Boolean);

  return sections.join("\n\n").slice(0, firecrawlLimits.maxRawContext);
};
