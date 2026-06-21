# R2 Image Storage

## What It Does

Generated and scanned images are copied into Cloudflare R2. The app stores R2 object keys in Convex and serves fresh signed URLs from Convex queries.

This keeps article images and product scan images from depending on temporary third-party URLs from Replicate, Firecrawl, or scraped site metadata.

## How It Works

The Convex app installs the R2 component in `convex/convex.config.ts`. `convex/r2/storeImageFromUrl.ts` is an authenticated action that downloads an external image URL, stores the bytes with `r2.store`, and returns the R2 key plus a signed serving URL.

Long-running Next.js routes also have a direct R2 fallback based on the same bucket credentials. If Clerk cannot mint a Convex JWT for an optional storage action, `storeImageUrlWithConvexR2` downloads the external image in the Next route, uploads it to R2 with the S3 API, and returns a signed URL. The saved key is still compatible with Convex R2 refresh queries because both paths write to the same bucket.

Product scan runs first, then `storeProductScanImages` copies logo/Open Graph assets and product screenshots into R2. The scan response includes the copied image URLs and the matching `assetKeys` and `productImageKeys`. `saveProductScan` stores those keys on the product workspace.

Blog generation creates images with Replicate, then `storeGeneratedBlogImages` downloads each Replicate image into R2 before the writer prompt is built. The blog stores each image's `r2Key` with the image metadata.

Convex queries refresh image URLs before returning data:

- `getCurrentProduct` refreshes `assets` and `productImages` from `assetKeys` and `productImageKeys`.
- `listBlogs` and `getBlog` refresh blog image URLs from each image `r2Key`.
- Blog MDX is rewritten on read when an old signed URL is replaced with a fresh one.

If R2 storage is unavailable during a server route call, the app keeps the original external URL so generation and scanning can still finish.

## Setup

Install dependencies:

```bash
npm install
```

Set R2 credentials on both the Vercel/Next.js deployment and the Convex deployment:

```bash
npx convex env set R2_TOKEN <token>
npx convex env set R2_ACCESS_KEY_ID <access-key-id>
npx convex env set R2_SECRET_ACCESS_KEY <secret-access-key>
npx convex env set R2_ENDPOINT <endpoint>
npx convex env set R2_BUCKET <bucket>
```

The R2 bucket must allow Convex to read and write objects.

## Relevant Code

- `convex/convex.config.ts`
- `convex/r2/client.ts`
- `convex/r2/storeImageFromUrl.ts`
- `convex/r2/getR2ImageUrl.ts`
- `convex/products/refreshProductImageUrls.ts`
- `convex/blogs/refreshBlogImageUrls.ts`
- `src/server/r2/storeImageUrlWithConvexR2.ts`
- `src/server/r2/storeImageUrlWithDirectR2.ts`
- `src/server/product/storeProductScanImages.ts`
- `src/server/blog/storeGeneratedBlogImages.ts`
- `src/app/api/product/scan/route.ts`
- `src/app/api/blogs/generate/route.ts`

## Use Cases

- Keep Replicate-generated blog images under the app's own storage.
- Keep scanned product screenshots and brand images available after source URLs change.
- Serve fresh image URLs when users reopen blogs or workspaces later.
- Include stored images in ZIP exports through the existing download flow.

## Source References

- Convex R2 component package: `@convex-dev/r2`
- Convex R2 component docs: `/Users/starship/.codex/attachments/5e11e617-71be-4440-a745-d14836fd1d87/pasted-text.txt`
- Convex schema: `convex/schema.ts`

## File Tree

```text
convex/convex.config.ts
convex/r2/
convex/products/refreshProductImageUrls.ts
convex/blogs/refreshBlogImageUrls.ts
src/server/r2/
src/server/product/storeProductScanImages.ts
src/server/blog/storeGeneratedBlogImages.ts
```
