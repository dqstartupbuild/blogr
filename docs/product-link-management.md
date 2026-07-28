# Product Link Management

## What It Does

Each product workspace keeps the links found during the site scan. Users can refresh those links from Settings, mark links as "do not use," and turn those links back on later.

Only active links are used for topic discovery, blog generation, product writer context, and internal link selection.

## How It Works

The Settings page shows `ProductLinksPanel` under the product scan controls. The panel shows Can use links by default. Its count buttons switch between Can use and Do not use without loading the product again. Each row keeps its "Do not use" or "Use again" action.

`refreshProductLinks` calls `POST /api/product/links/refresh`, which uses the same sitemap, homepage, and Firecrawl crawl logic as the full product scan. The client merges the refreshed URLs with the current link states, so a paused URL stays paused when it is found again.

Repeat full-site scans protect the current link list before the slow scan starts. The temporary product save keeps the existing Convex link list, and the pending browser state shows those same links instead of replacing them with a new homepage-only list. When the scan finishes, the same merge behavior preserves matching "do not use" choices and enables newly found links.

`updateProductSiteLinks` saves the edited list to the active Convex product workspace. The link shape includes optional `isActive`; missing values are treated as active for older saved workspaces.

## Relevant Code

- `src/app/api/product/links/refresh/route.ts`
- `src/app/api/product/links/refresh/schema.ts`
- `src/server/product/refreshProductSiteLinks.ts`
- `src/server/product/collectProductSiteLinkUrls.ts`
- `src/features/workspace/components/ProductLinksPanel.tsx`
- `src/features/workspace/components/ProductLinkRow.tsx`
- `src/features/workspace/components/ProductLinkFilterButton.tsx`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/mappers/buildPendingProductScanProduct.ts`
- `src/features/workspace/utils/isLinkActive.ts`
- `src/features/workspace/utils/filterActiveLinks.ts`
- `src/features/workspace/utils/filterProductLinksByStatus.ts`
- `src/features/workspace/utils/mergeProductLinkStates.ts`
- `src/features/workspace/utils/setProductLinkActiveState.ts`
- `convex/products/updateProductSiteLinks.ts`

## Use Cases

- Refresh scanned links after adding new pages to a site.
- Pause thin, private, outdated, or off-topic pages.
- Focus on usable links first, then open the Do not use filter when needed.
- Turn a paused link back on when it becomes useful again.
- Keep generated blogs from linking to pages the user does not want promoted.

## File Tree

```text
src/app/api/product/links/refresh/
src/server/product/*ProductSiteLink*
src/features/workspace/components/ProductLink*
src/features/workspace/utils/*Link*
convex/products/updateProductSiteLinks.ts
```
