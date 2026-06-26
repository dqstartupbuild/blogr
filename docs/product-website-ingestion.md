# Product Website Ingestion

## What It Does

The user enters a website and niche from the active workspace's Settings tab. The app scans the site, collects product context, finds internal links, extracts brand assets and colors, copies scanned images into R2, indexes the scanned context for retrieval, and saves the product profile to that workspace in Convex.

This gives the writer enough context to understand the product and place internal links naturally in future blog posts.

## How It Works

1. The Settings page saves the website and niche to the active product workspace through Convex right away.
2. `POST /api/product/scan` checks the signed-in user.
3. `scanProductWebsite` normalizes the URL and calls Firecrawl.
4. The scanner reads homepage markdown, branding, links, screenshots, sitemap links, and crawl links.
5. It picks detail pages like pricing, features, product, docs, about, and use-case pages.
6. It asks the configured Replicate writer model to turn the scraped context into a simple product profile.
7. The scan route downloads logo/Open Graph assets and product screenshots into R2. It uses the Convex R2 action when Convex auth is available and otherwise writes directly to the same R2 bucket with the signed-in user's ID.
8. The scan route indexes the product profile, internal links, and raw scanned context in the Convex RAG component under the active product workspace.
9. The Settings page saves the finished product profile and R2 image keys through the signed-in Convex client.
10. Users can refresh scanned links without running the full product profile scan. Refreshing links uses the same sitemap, homepage link, and crawl collection logic, then saves the refreshed link list through Convex.

The route allows a longer runtime because Firecrawl plus AI extraction can take
more than a quick request. The workspace shows scan progress, success, and any
server error so failed scans are visible.

The browser saves a basic product record before the slow scan starts. If the
slow scan times out after Firecrawl or Replicate runs, the workspace still keeps
the site and niche instead of losing everything. This uses the same signed-in
Convex client path that saves topics.

When multiple product workspaces exist, `saveProductScan` receives the active
product ID and updates that workspace only. If no product exists yet, the scan
creates the first product workspace and makes it active.

Live workspaces start with empty product inputs in Settings. Demo mode uses example
product copy only when Clerk and Convex are not configured.

Scanned links can be marked as "do not use" and turned back on later. The link state is stored on each link as optional `isActive`, and missing values are treated as active for older saved workspaces.

## Relevant Code

- `src/app/api/product/scan/route.ts`
- `src/app/api/product/scan/schema.ts`
- `src/app/api/product/links/refresh/route.ts`
- `src/app/api/product/links/refresh/schema.ts`
- `src/features/workspace/components/ProductSetupPanel.tsx`
- `src/features/workspace/components/ProductLinksPanel.tsx`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/mappers/buildInitialProductScanProduct.ts`
- `src/server/product/scanProductWebsite.ts`
- `src/server/product/refreshProductSiteLinks.ts`
- `src/server/product/collectProductSiteLinkUrls.ts`
- `src/server/product/storeProductScanImages.ts`
- `src/server/product/extractProductProfile.ts`
- `src/server/r2/storeImageUrlWithConvexR2.ts`
- `src/server/rag/indexProductRagContext.ts`
- `src/server/firecrawl/*`
- `src/server/replicate/runReplicateText.ts`
- `convex/rag/indexProductContext.ts`
- `convex/rag/buildProductRagText.ts`
- `convex/products/saveProductScan.ts`
- `convex/products/updateProductSiteLinks.ts`
- `convex/products/getCurrentProduct.ts`

## Data Collected

- Website URL
- Product name
- Description
- Niche
- Audience
- Competitors when clear
- Brand colors
- Logo and Open Graph assets
- Product screenshots when Firecrawl returns them
- R2 keys for copied scan images
- Internal site links
- Link active or do-not-use state
- Raw page context for writing
- RAG chunks for future product-specific retrieval

## Source References

- Firecrawl v2 scrape, crawl, and search docs: https://docs.firecrawl.dev
- Launchgen reference scanner: `/Users/starship/Documents/GitHub/launchgen/src/app/api/brands/scan/route.ts`
- Replicate Node client docs: https://replicate.com/docs/get-started/nodejs

## File Tree

```text
src/app/api/product/scan/
src/app/api/product/links/refresh/
src/server/product/
src/server/r2/
src/server/rag/
src/server/firecrawl/
src/server/replicate/
convex/r2/
convex/rag/
convex/products/
```
