import { buildInitialProductLink } from "./buildInitialProductLink";
import { normalizeProductWebsiteUrl } from "./normalizeProductWebsiteUrl";
import type { ProductScanProduct } from "../types/ProductScanProduct";

type BuildInitialProductScanProductOptions = {
  niche: string;
  websiteUrl: string;
};

export const buildInitialProductScanProduct = ({
  niche,
  websiteUrl,
}: BuildInitialProductScanProductOptions): ProductScanProduct => {
  const normalizedUrl = normalizeProductWebsiteUrl(websiteUrl);
  if (!normalizedUrl) throw new Error("Use a real website URL.");

  const cleanNiche = niche.trim();
  const host = new URL(normalizedUrl).hostname.replace(/^www\./i, "");

  return {
    assets: [],
    assetKeys: [],
    audience: "",
    colors: ["#000000", "#ffffff"],
    competitors: "",
    description: "We saved your site. The full scan is still running.",
    name: host,
    niche: cleanNiche,
    productImages: [],
    productImageKeys: [],
    rawContext: `Website: ${normalizedUrl}\nNiche: ${cleanNiche}`,
    siteLinks: [buildInitialProductLink(normalizedUrl)],
    websiteUrl: normalizedUrl,
  };
};
