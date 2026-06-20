# Zip Export

## What It Does

Users can download a generated blog as a zip that can be dropped into an MDX blog repo.

## How It Works

Downloading from the app calls `POST /api/blogs/download` with the blog that is already loaded in the browser.

The download route checks the signed-in user, collects feature and inline image URLs from the posted blog, fetches any images it can, rewrites those image URLs to local `./images/...` paths, and builds a zip.

If an image cannot be fetched, the original remote URL stays in the MDX.

The old `GET /api/blogs/[blogId]/download` route returns a simple message so
stale links do not trigger a server-side Convex read.

## Zip Contents

- `{slug}.mdx`
- `README.md`
- `metadata.json`
- `images/` with downloaded images

## Relevant Code

- `src/app/api/blogs/download/route.ts`
- `src/features/workspace/components/BlogZipButton.tsx`
- `src/features/workspace/utils/downloadBlogZip.ts`
- `src/server/download/buildBlogZip.ts`
- `src/server/download/collectBlogImageUrls.ts`
- `src/server/download/downloadBlogImages.ts`
- `src/server/download/replaceImageUrlsInMdx.ts`
- `src/server/download/buildBlogMetadata.ts`
- `src/server/download/buildBlogReadme.ts`

## File Tree

```text
src/app/api/blogs/download/
src/features/workspace/components/BlogZipButton.tsx
src/features/workspace/utils/
src/server/download/
```
