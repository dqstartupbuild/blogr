import { firecrawlLimits } from "./constants/firecrawlLimits";
import { fetchFirecrawlScrape } from "./fetchFirecrawlScrape";
import type { DetailPage } from "./types/DetailPage";

type FetchDetailMarkdownOptions = {
  apiKey: string;
  links: string[];
};

export const fetchDetailMarkdown = async ({
  apiKey,
  links,
}: FetchDetailMarkdownOptions) => {
  const results = await Promise.all(
    links.map(async (link): Promise<DetailPage> => {
      try {
        const data = await fetchFirecrawlScrape({
          apiKey,
          formats: ["markdown"],
          url: link,
        });

        return {
          markdown: (data?.markdown || "").slice(0, firecrawlLimits.maxPageMarkdown),
          url: link,
        };
      } catch {
        return { markdown: "", url: link };
      }
    }),
  );

  return results.filter((result) => result.markdown);
};
