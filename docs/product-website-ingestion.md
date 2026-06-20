# Product Website Ingestion

## What It Does

The user enters a website and niche. The app scans the site, collects product context, finds internal links, extracts brand assets and colors, and saves the product profile to Convex.

This gives the writer enough context to understand the product and place internal links naturally in future blog posts.

## How It Works

1. `POST /api/product/scan` checks the signed-in user.
2. `scanProductWebsite` normalizes the URL and calls Firecrawl.
3. The scanner reads homepage markdown, branding, links, screenshots, sitemap links, and crawl links.
4. It picks detail pages like pricing, features, product, docs, about, and use-case pages.
5. It asks the configured Replicate writer model to turn the scraped context into a simple product profile.
6. It saves the result through `saveProductScan` when Convex is configured.

The route allows a longer runtime because Firecrawl plus AI extraction can take
more than a quick request. The workspace shows scan progress, success, and any
server error so failed scans are visible.

Live workspaces start with empty product inputs. Demo mode uses example product
copy only when Clerk and Convex are not configured.

## Relevant Code

- `src/app/api/product/scan/route.ts`
- `src/app/api/product/scan/schema.ts`
- `src/features/workspace/components/ProductSetupPanel.tsx`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/server/product/scanProductWebsite.ts`
- `src/server/product/extractProductProfile.ts`
- `src/server/firecrawl/*`
- `src/server/replicate/runReplicateText.ts`
- `convex/products/saveProductScan.ts`
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
- Internal site links
- Raw page context for writing

## Source References

- Firecrawl v2 scrape, crawl, and search docs: https://docs.firecrawl.dev
- Launchgen reference scanner: `/Users/starship/Documents/GitHub/launchgen/src/app/api/brands/scan/route.ts`
- Replicate Node client docs: https://replicate.com/docs/get-started/nodejs

## File Tree

```text
src/app/api/product/scan/
src/server/product/
src/server/firecrawl/
src/server/replicate/
convex/products/
```
