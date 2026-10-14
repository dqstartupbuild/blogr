import { firecrawlBaseUrl } from "./constants/firecrawlBaseUrl";
import { firecrawlLimits } from "./constants/firecrawlLimits";
import { normalizeSiteLink } from "./normalizeSiteLink";
import type { FirecrawlCrawlStartResponse } from "./types/FirecrawlCrawlStartResponse";
import type { FirecrawlCrawlStatusResponse } from "./types/FirecrawlCrawlStatusResponse";

type FetchFirecrawlCrawlLinksOptions = {
  apiKey: string;
  url: string;
};

export const fetchFirecrawlCrawlLinks = async ({
  apiKey,
  url,
}: FetchFirecrawlCrawlLinksOptions) => {
  const response = await fetch(`${firecrawlBaseUrl}/crawl`, {
    body: JSON.stringify({
      url,
      limit: firecrawlLimits.crawlLimit,
      scrapeOptions: {
        formats: ["links"],
        onlyMainContent: true,
      },
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const startData = (await response.json()) as FirecrawlCrawlStartResponse;

  if (!response.ok || startData.success === false || !startData.id) {
    return [];
  }

  const statusUrl = startData.url || `${firecrawlBaseUrl}/crawl/${startData.id}`;
  const baseHost = new URL(url).hostname.replace(/^www\./i, "");
  const links = new Set<string>();
  let nextUrl: string | null = statusUrl;
  let polls = 0;

  while (nextUrl && polls < firecrawlLimits.maxCrawlPolls) {
    const statusResponse = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const statusData = (await statusResponse.json()) as FirecrawlCrawlStatusResponse;

    statusData.data?.forEach((doc) => {
      const raw =
        doc.metadata?.sourceURL ||
        doc.metadata?.sourceUrl ||
        doc.metadata?.url ||
        doc.url;

      if (!raw) return;

      const normalized = normalizeSiteLink(raw, baseHost);
      if (normalized) links.add(normalized);
    });

    if (statusData.next) {
      nextUrl = statusData.next;
      continue;
    }

    if (statusData.status === "completed" || statusData.status === "failed") {
      break;
    }

    polls += 1;
    nextUrl = statusUrl;
    await new Promise((resolve) =>
      setTimeout(resolve, firecrawlLimits.crawlPollDelayMs),
    );
  }

  return Array.from(links);
};
