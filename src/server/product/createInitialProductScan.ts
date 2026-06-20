import { buildSiteLinkItems } from "./buildSiteLinkItems";
import { normalizeUrl } from "../firecrawl/normalizeUrl";
import type { ProductScanResult } from "./types/ProductScanResult";

type CreateInitialProductScanOptions = {
  nicheHint?: string;
  websiteUrl: string;
};

export const createInitialProductScan = ({
  nicheHint = "",
  websiteUrl,
}: CreateInitialProductScanOptions): ProductScanResult => {
  const normalizedUrl = normalizeUrl(websiteUrl);
  if (!normalizedUrl) throw new Error("Use a real website URL.");

  const host = new URL(normalizedUrl).hostname.replace(/^www\./i, "");

  return {
    assets: [],
    audience: "",
    colors: ["#000000", "#ffffff"],
    competitors: "",
    description: "We saved your site. The full scan is still running.",
    name: host,
    niche: nicheHint,
    productImages: [],
    rawContext: `Website: ${normalizedUrl}\nNiche: ${nicheHint}`,
    siteLinks: buildSiteLinkItems([normalizedUrl]),
    websiteUrl: normalizedUrl,
  };
};
