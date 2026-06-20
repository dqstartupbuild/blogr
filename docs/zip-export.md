# Zip Export

## What It Does

Users can download a generated blog as a zip that can be dropped into an MDX blog repo.

## How It Works

Downloading calls `GET /api/blogs/[blogId]/download`.

The download route loads the blog from Convex, collects feature and inline image URLs, fetches any images it can, rewrites those image URLs to local `./images/...` paths, and builds a zip.

If an image cannot be fetched, the original remote URL stays in the MDX.

The route first tries the normal Clerk-to-Convex token read. If Clerk cannot
mint the Convex server token, the route uses the already authenticated Clerk
user id and asks Convex for that blog only when `blog.userId` matches.

## Zip Contents

- `{slug}.mdx`
- `README.md`
- `metadata.json`
- `images/` with downloaded images

## Relevant Code

- `src/app/api/blogs/[blogId]/download/route.ts`
- `src/server/convex/fetchRouteBlog.ts`
- `src/server/download/buildBlogZip.ts`
- `src/server/download/collectBlogImageUrls.ts`
- `src/server/download/downloadBlogImages.ts`
- `src/server/download/replaceImageUrlsInMdx.ts`
- `src/server/download/buildBlogMetadata.ts`
- `src/server/download/buildBlogReadme.ts`

## File Tree

```text
src/app/api/blogs/[blogId]/download/
src/server/convex/fetchRouteBlog.ts
src/server/download/
convex/blogs/getBlogForRoute.ts
```
