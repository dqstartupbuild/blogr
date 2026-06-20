import type { FirecrawlScrapeData } from "../firecrawl/types/FirecrawlScrapeData";
import type { DetailPage } from "../firecrawl/types/DetailPage";

type BuildProductProfilePromptOptions = {
  colors: string[];
  detailPages: DetailPage[];
  homepageMarkdown: string;
  nicheHint: string;
  scrapeData?: FirecrawlScrapeData;
  websiteUrl: string;
};

export const buildProductProfilePrompt = ({
  colors,
  detailPages,
  homepageMarkdown,
  nicheHint,
  scrapeData,
  websiteUrl,
}: BuildProductProfilePromptOptions) => {
  return `
Read this website data and return only JSON.

Use plain, simple words. Do not invent facts. If a detail is not clear, use an empty string.

JSON shape:
{
  "name": "product or brand name",
  "description": "3 to 8 simple sentences about what it does, who it helps, key features, and why it is different",
  "niche": "short niche phrase",
  "audience": "who this is for",
  "competitors": "comma-separated competitors if clearly mentioned",
  "colors": ["#000000"]
}

Website:
${websiteUrl}

Niche hint:
${nicheHint}

Metadata:
${JSON.stringify(scrapeData?.metadata || {}, null, 2)}

Branding:
${JSON.stringify(scrapeData?.branding || {}, null, 2)}

Color candidates:
${JSON.stringify(colors, null, 2)}

Homepage markdown:
${homepageMarkdown.slice(0, 6000)}

Detail pages:
${detailPages.map((page) => `URL: ${page.url}\n${page.markdown}`).join("\n\n")}
`.trim();
};
