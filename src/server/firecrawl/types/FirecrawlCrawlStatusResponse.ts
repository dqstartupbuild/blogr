export type FirecrawlCrawlStatusResponse = {
  status?: string;
  next?: string | null;
  data?: Array<{
    metadata?: {
      sourceURL?: string;
      sourceUrl?: string;
      url?: string;
    };
    url?: string;
  }>;
  error?: string;
};
