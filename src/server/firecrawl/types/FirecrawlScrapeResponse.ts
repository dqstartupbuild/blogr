import type { FirecrawlScrapeData } from "./FirecrawlScrapeData";

export type FirecrawlScrapeResponse = {
  success?: boolean;
  data?: FirecrawlScrapeData;
  error?: string;
};
