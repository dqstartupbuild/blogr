# Editable Product Details

## Overview

Every product detail shown in Settings can be corrected by the user after a scan. The saved profile covers the product name, website, niche, audience, description, competitors, brand colors, features, pricing, trials or special offers, and external app or extension links.

## Website Prefill

The existing Firecrawl scan still gathers homepage content, detail pages, links, branding, and screenshots. The product-profile extraction now also asks for:

- Clearly supported product features.
- Exact prices and plan names displayed on the site.
- Billing periods and short plan details.
- Discounts, free plans, trials, and special offers.
- Exact app-store or extension-marketplace URLs found in the scraped data.

The scanner separately checks scraped links and markdown for known marketplaces such as the Apple App Store, Google Play, Chrome Web Store, Firefox Add-ons, Microsoft stores, Visual Studio Marketplace, Snap Store, Flathub, and Steam. Social links and unrelated external URLs are not added automatically.

Missing details stay empty instead of being invented. Users can add, edit, or remove every feature, price, offer, color, and external link themselves.

## Saving

`ProductDetailsPanel` keeps the form draft in the browser and sends one complete product-details payload when Save product details is clicked. `updateProductDetails` performs one product ownership read, patches the product, and updates the existing product profile and workspace summary read models. It does not reload the full product before saving.

Scan-only fields such as raw page context, internal site links, stored images, generation settings, and publishing settings are preserved when manual details are saved.

The writer receives features, pricing, offers, and external product links in its normal product context. Product scans also include those fields in the RAG text indexed for future article retrieval.

## Relevant Code

- `convex/products/updateProductDetails.ts`
- `convex/products/productPriceValidator.ts`
- `convex/products/productExternalLinkValidator.ts`
- `src/features/workspace/components/ProductDetailsPanel.tsx`
- `src/features/workspace/components/ProductPricingEditor.tsx`
- `src/features/workspace/components/ProductExternalLinksEditor.tsx`
- `src/features/workspace/components/StringListEditor.tsx`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/server/product/buildProductProfilePrompt.ts`
- `src/server/product/collectProductExternalLinks.ts`
- `src/server/product/scanProductWebsite.ts`
- `src/server/blog/buildBlogWriterProductContext.ts`
- `convex/rag/buildProductRagText.ts`

## Use Cases

- Correct a product description after a scan.
- Add a feature that was not listed clearly on the website.
- Keep monthly and annual plans separate.
- Record a free trial, launch discount, or free plan.
- Add iOS, Android, browser extension, desktop store, or integration links.
- Remove an outdated offer or marketplace listing.

## File Tree

```text
convex/products/
├── productExternalLinkValidator.ts
├── productPriceValidator.ts
└── updateProductDetails.ts
src/features/workspace/
├── components/
│   ├── ProductDetailsPanel.tsx
│   ├── ProductExternalLinksEditor.tsx
│   ├── ProductPricingEditor.tsx
│   └── StringListEditor.tsx
└── types/
    ├── ProductDetailsDraft.ts
    ├── ProductExternalLink.ts
    └── ProductPrice.ts
src/server/product/
├── buildProductProfilePrompt.ts
├── collectProductExternalLinks.ts
└── scanProductWebsite.ts
```
