export type FirecrawlScrapeData = {
  markdown?: string;
  html?: string;
  rawHtml?: string;
  screenshot?: string;
  metadata?: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogSiteName?: string;
    sourceURL?: string;
  };
  branding?: {
    colorScheme?: string;
    logo?: string;
    colors?: Record<string, string>;
    images?: {
      logo?: string;
      favicon?: string;
      ogImage?: string;
    };
    fonts?: Array<{ family?: string }>;
    personality?: unknown;
  };
  links?: string[] | { links?: string[] };
};
