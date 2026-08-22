import type { FirecrawlSearchResult } from "./FirecrawlSearchResult";

export type FirecrawlSearchResponse = {
  success?: boolean;
  data?: FirecrawlSearchResult[];
  error?: string;
};
