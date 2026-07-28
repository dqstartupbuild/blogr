import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { buildPendingProductScanProduct } from "./buildPendingProductScanProduct.ts";

const initialProduct = {
  assetKeys: [],
  assets: [],
  audience: "",
  colors: ["#000000", "#ffffff"],
  competitors: "",
  description: "Scanning",
  externalLinks: [],
  features: [],
  name: "example.com",
  niche: "",
  offers: [],
  pricing: [],
  productImageKeys: [],
  productImages: [],
  rawContext: "Website: https://example.com",
  siteLinks: [{ title: "example.com", url: "https://example.com" }],
  websiteUrl: "https://example.com",
};

test("keeps existing link choices while a repeat scan is pending", () => {
  const existingSiteLinks = [
    {
      isActive: false,
      title: "Pricing",
      url: "https://example.com/pricing",
    },
  ];

  const pendingProduct = buildPendingProductScanProduct({
    existingSiteLinks,
    initialProduct,
  });

  assert.deepEqual(pendingProduct.siteLinks, existingSiteLinks);
});

test("uses the initial homepage link for a new product scan", () => {
  const pendingProduct = buildPendingProductScanProduct({
    initialProduct,
  });

  assert.deepEqual(pendingProduct.siteLinks, initialProduct.siteLinks);
});
