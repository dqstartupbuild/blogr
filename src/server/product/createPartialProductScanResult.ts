import { normalizeUrl } from "../firecrawl/normalizeUrl";
import { buildSiteLinkItems } from "./buildSiteLinkItems";
import type { ProductScanResult } from "./types/ProductScanResult";

type CreatePartialProductScanResultOptions = {
  nicheHint?: string;
  websiteUrl: string;
};

export const createPartialProductScanResult = ({
  nicheHint = "",
  websiteUrl,
}: CreatePartialProductScanResultOptions): ProductScanResult => {
  const normalizedUrl = normalizeUrl(websiteUrl);
  if (!normalizedUrl) throw new Error("Use a real website URL.");

  const host = new URL(normalizedUrl).hostname.replace(/^www\./i, "");
  const niche = nicheHint.trim();

  return {
    assets: [],
    assetKeys: [],
    audience: "",
    colors: ["#000000", "#ffffff"],
    competitors: "",
    description: "We saved your site. Try scanning again in a little while.",
    name: host,
    niche,
    productImageKeys: [],
    productImages: [],
    rawContext: `Website: ${normalizedUrl}\nNiche: ${niche}`,
    siteLinks: buildSiteLinkItems([normalizedUrl]),
    websiteUrl: normalizedUrl,
  };
};
