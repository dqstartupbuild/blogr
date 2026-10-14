import { firecrawlLimits } from "./constants/firecrawlLimits";
import { extractLocsFromXml } from "./extractLocsFromXml";
import { fetchRobotsSitemaps } from "./fetchRobotsSitemaps";
import { fetchXml } from "./fetchXml";
import { normalizeSiteLink } from "./normalizeSiteLink";

export const fetchSitemapLinks = async (baseUrl: string) => {
  const url = new URL(baseUrl);
  const origin = url.origin;
  const baseHost = url.hostname.replace(/^www\./i, "");
  const sitemapUrls = new Set<string>();
  const robotsSitemaps = await fetchRobotsSitemaps(origin);

  robotsSitemaps.forEach((link) => sitemapUrls.add(link));

  if (sitemapUrls.size === 0) {
    sitemapUrls.add(`${origin}/sitemap.xml`);
    sitemapUrls.add(`${origin}/sitemap_index.xml`);
  }

  const queue = Array.from(sitemapUrls);
  const visited = new Set<string>();
  const links = new Set<string>();
  let fetches = 0;

  while (queue.length > 0 && fetches < firecrawlLimits.maxSitemapFetches) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || visited.has(sitemapUrl)) continue;

    visited.add(sitemapUrl);
    fetches += 1;

    const xml = await fetchXml(sitemapUrl);
    if (!xml) continue;

    const locs = extractLocsFromXml(xml);
    if (/<sitemapindex/i.test(xml)) {
      locs.forEach((loc) => {
        if (!visited.has(loc)) queue.push(loc);
      });
      continue;
    }

    locs.forEach((loc) => {
      const normalized = normalizeSiteLink(loc, baseHost);
      if (normalized) links.add(normalized);
    });
  }

  return Array.from(links);
};
