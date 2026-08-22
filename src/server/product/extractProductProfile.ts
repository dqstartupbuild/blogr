import { mergeUniqueColors } from "../firecrawl/mergeUniqueColors";
import { runReplicateText } from "../replicate/runReplicateText";
import { buildProductProfilePrompt } from "./buildProductProfilePrompt";
import { createFallbackProductProfile } from "./createFallbackProductProfile";
import { parseProductProfileJson } from "./parseProductProfileJson";
import { normalizeProductExternalLinks } from "./normalizeProductExternalLinks";
import { normalizeProductPrices } from "./normalizeProductPrices";
import { normalizeProductStringList } from "./normalizeProductStringList";
import type { FirecrawlScrapeData } from "../firecrawl/types/FirecrawlScrapeData";
import type { DetailPage } from "../firecrawl/types/DetailPage";
import type { ProductProfileDraft } from "./types/ProductProfileDraft";

type ExtractProductProfileOptions = {
  colors: string[];
  detailPages: DetailPage[];
  homepageMarkdown: string;
  nicheHint: string;
  scrapeData?: FirecrawlScrapeData;
  websiteUrl: string;
};

export const extractProductProfile = async (
  options: ExtractProductProfileOptions,
): Promise<ProductProfileDraft> => {
  if (!process.env.REPLICATE_API_TOKEN) {
    return createFallbackProductProfile(options);
  }

  const prompt = buildProductProfilePrompt(options);
  const text = await runReplicateText({
    maxTokens: 2600,
    prompt,
    systemPrompt:
      "You turn website data into a simple product profile for blog writing. Return JSON only.",
  });
  const profile = parseProductProfileJson(text);

  return {
    ...profile,
    colors: mergeUniqueColors(profile.colors || [], options.colors),
    externalLinks: normalizeProductExternalLinks(profile.externalLinks),
    features: normalizeProductStringList(profile.features),
    offers: normalizeProductStringList(profile.offers),
    pricing: normalizeProductPrices(profile.pricing),
  };
};
